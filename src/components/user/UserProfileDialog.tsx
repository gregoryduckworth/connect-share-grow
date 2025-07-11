import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { userService } from '@/lib/backend/services/userService';
import { connectionService } from '@/lib/backend/services/connectionService';
import type { User, ConnectionRequest } from '@/lib/types';
import AppAvatar from '@/components/common/AppAvatar';
import { useDialog } from '@/hooks/useDialog';
import { formatDate } from '@/lib/utils'; // Import formatDate
import { Skeleton } from '@/components/ui/skeleton';

export interface UserProfileDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  showConnectionButton?: boolean;
  loading?: boolean;
}

const UserProfileDialog = ({
  userId,
  isOpen,
  onClose,
  showConnectionButton = true,
  loading = false,
}: UserProfileDialogProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [_connectionPending, setConnectionPending] = useState(false);
  const requestDialog = useDialog(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loadingUser, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'pending' | 'incoming' | 'none'
  >('none');

  // Helper to refresh status from backend
  const refreshConnectionStatus = async () => {
    if (!currentUser?.id || !userId || currentUser.id === userId) {
      setConnectionStatus('none');
      return;
    }
    // Check for incoming request first
    const requests: { fromUserId: string; toUserId: string }[] =
      await connectionService.getConnectionRequestsForUser(currentUser.id);
    if (requests.some((r) => r.fromUserId === userId && r.toUserId === currentUser.id)) {
      setConnectionStatus('incoming');
      return;
    }
    // Then check for established connection
    const connections: { id: string }[] = await connectionService.getConnectionsForUser(
      currentUser.id,
    );
    if (connections.some((c) => c.id === userId)) {
      setConnectionStatus('connected');
      return;
    }
    // Then check for outgoing request
    if (requests.some((r) => r.toUserId === userId && r.fromUserId === currentUser.id)) {
      setConnectionStatus('pending');
      return;
    }
    setConnectionStatus('none');
  };

  useEffect(() => {
    setLoading(true);
    userService.getUserById(userId).then((u) => {
      setUser(u);
      setLoading(false);
    });
    refreshConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentUser?.id]);

  const handleSendConnectionRequest = async () => {
    requestDialog.open();
  };

  const handleRequestSubmit = async () => {
    if (!requestMessage.trim()) {
      setRequestError('A message is required to send a connection request.');
      return;
    }
    // Save to localStorage (append to array)
    const requests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
    requests.push({
      id: user?.id,
      name: user?.name,
      message: requestMessage,
      date: new Date().toISOString(),
      fromUserId: currentUser?.id,
      toUserId: userId,
    });
    localStorage.setItem('connectionRequests', JSON.stringify(requests));
    setRequestMessage('');
    setRequestError('');
    requestDialog.close();
    toast({
      title: 'Connection request sent',
      description: `Connection request sent to ${user?.name}`,
    });
    await refreshConnectionStatus();
  };

  const handleAcceptIncomingRequest = async () => {
    if (!currentUser?.id || !userId) return;
    await connectionService.addConnection(currentUser.id, userId, 'connected');
    await connectionService.addConnection(userId, currentUser.id, 'connected');
    // Remove the request from the mock data (in a real app, backend would handle this)
    const requests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
    const updatedRequests = requests.filter(
      (r: ConnectionRequest) => !(r.fromUserId === userId && r.toUserId === currentUser.id),
    );
    localStorage.setItem('connectionRequests', JSON.stringify(updatedRequests));
    toast({
      title: 'Connection accepted',
      description: `You are now connected with ${user?.name}`,
    });
    await refreshConnectionStatus();
  };

  const handleDeclineIncomingRequest = async () => {
    if (!currentUser?.id || !userId) return;
    // Remove the request from the mock data (in a real app, backend would handle this)
    const requests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
    const updatedRequests = requests.filter(
      (r: ConnectionRequest) => !(r.fromUserId === userId && r.toUserId === currentUser.id),
    );
    localStorage.setItem('connectionRequests', JSON.stringify(updatedRequests));
    toast({
      title: 'Request declined',
      description: `You declined the connection request from ${user?.name}`,
    });
    await refreshConnectionStatus();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User not found</DialogTitle>
          </DialogHeader>
          <div className="text-social-muted">This user does not exist.</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <AppAvatar size="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </AppAvatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600 mb-3">{user.bio}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {userId !== currentUser?.id && (
                  <div className="flex gap-2">
                    {showConnectionButton && (
                      <>
                        {connectionStatus === 'connected' && (
                          <Button variant="outline" size="sm" disabled>
                            Connected
                          </Button>
                        )}
                        {connectionStatus === 'pending' && (
                          <Button variant="outline" size="sm" disabled>
                            Pending
                          </Button>
                        )}
                        {connectionStatus === 'incoming' && (
                          <>
                            <Button onClick={handleAcceptIncomingRequest} size="sm">
                              Accept
                            </Button>
                            <Button
                              onClick={handleDeclineIncomingRequest}
                              size="sm"
                              variant="outline"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {connectionStatus === 'none' && (
                          <Button onClick={handleSendConnectionRequest} size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Request Dialog */}
      <Dialog open={requestDialog.isOpen} onOpenChange={requestDialog.setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please include a message with your connection request to{' '}
              <span className="font-semibold">{user.name}</span>.
            </p>
            <Textarea
              value={requestMessage}
              onChange={(e) => {
                setRequestMessage(e.target.value);
                setRequestError('');
              }}
              placeholder="Write a message..."
              rows={4}
              className="w-full"
              autoFocus
            />
            {requestError && <div className="text-red-500 text-xs">{requestError}</div>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => requestDialog.close()}>
                Cancel
              </Button>
              <Button onClick={handleRequestSubmit}>Send Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileDialog;
