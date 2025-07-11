import { useState, useEffect } from 'react';
import { Search, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfileDialog from '@/components/user/UserProfileDialog';
import InfoCard from '@/components/ui/InfoCard';
import UserProfileLink from '@/components/user/UserProfileLink';
import { connectionService } from '@/lib/backend/services/connectionService';
import { userService } from '@/lib/backend/services/userService';
import { useAuth } from '@/contexts/useAuth';
import { Connection, ConnectionRequest } from '@/lib/types';
import { useDialog } from '@/hooks/useDialog';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useChatThread } from '@/contexts/ChatThreadContext';
import { Skeleton } from '@/components/ui/skeleton';

const ConnectionsPage = () => {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId] = useState<string | null>(null);
  const profileDialog = useDialog(false);
  const [connections, setConnections] = useState<(Connection & { chatThreadId?: string })[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; bio?: string }[]>([]);
  const navigate = useNavigate();
  const { setSelectedThreadId } = useChatThread();

  useEffect(() => {
    if (!user?.id) return;
    // Load connections for the current user from backend service
    Promise.all([
      connectionService.getConnectionsForUser(user.id),
      connectionService.getConnectionRequestsForUser(user.id),
      userService.getUsers(),
    ]).then(([conns, requests, users]) => {
      setConnections(
        conns.map(
          (c: {
            id: string;
            status: 'connected' | 'pending' | 'received';
            lastActive: Date;
            chatThreadId?: string;
          }) => {
            const userObj = users.find(
              (u: { id: string; name: string; bio?: string }) => u.id === c.id,
            );
            return {
              id: c.id,
              name: userObj?.name || 'Unknown',
              status: c.status,
              lastActive: c.lastActive,
              bio: userObj?.bio,
              chatThreadId: c.chatThreadId,
            };
          },
        ),
      );
      setIncomingRequests(requests.filter((r: { toUserId: string }) => r.toUserId === user.id));
      setOutgoingRequests(requests.filter((r: { fromUserId: string }) => r.fromUserId === user.id));
      setAllUsers(users);
    });
  }, [user?.id]);

  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Accept or decline a connection request
  const handleAcceptRequest = async (request: ConnectionRequest) => {
    if (user) {
      await connectionService.addConnection(user.id, request.fromUserId, 'connected');
      await connectionService.addConnection(request.fromUserId, user.id, 'connected');
    }
    // Remove the request from the mock data (in a real app, backend would handle this)
    setIncomingRequests((prev) =>
      prev.filter((r) => !(r.fromUserId === request.fromUserId && r.toUserId === request.toUserId)),
    );
  };
  const handleDeclineRequest = async (request: ConnectionRequest) => {
    // Remove the request from the mock data (in a real app, backend would handle this)
    setIncomingRequests((prev) =>
      prev.filter((r) => !(r.fromUserId === request.fromUserId && r.toUserId === request.toUserId)),
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-2 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen" data-testid="connections-page">
      <div className="mb-6" data-testid="connections-header">
        <h1 className="text-3xl font-bold text-social-primary mb-2" data-testid="connections-title">
          My Connections
        </h1>
        <p
          className="text-sm sm:text-base text-muted-foreground"
          data-testid="connections-description"
        >
          Manage your network and connection requests
        </p>
      </div>

      <div
        className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        data-testid="connections-search-container"
      >
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 pointer-events-none rounded-lg border border-purple-200 bg-gradient-to-r from-purple-100/40 to-blue-100/20"
            style={{ zIndex: 0 }}
          />
          <div className="flex items-center gap-2 relative z-10 p-1 rounded-lg bg-white/90 border border-purple-200 w-full focus-within:border-purple-500 focus-within:shadow-lg focus-within:shadow-purple-200/40 transition-colors">
            <Search className="ml-3 text-social-primary h-5 w-5" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none shadow-none min-w-0 flex-1"
              style={{ boxShadow: 'none' }}
              data-testid="connections-search-input"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="connected" className="w-full" data-testid="connections-tabs">
        <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="connections-tabs-list">
          <TabsTrigger value="connected" className="text-xs sm:text-sm" data-testid="tab-connected">
            Connected ({filteredConnections.length})
          </TabsTrigger>
          <TabsTrigger value="incoming" className="text-xs sm:text-sm" data-testid="tab-incoming">
            Incoming ({incomingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="text-xs sm:text-sm" data-testid="tab-outgoing">
            Outgoing ({outgoingRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" data-testid="tab-content-connected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection) => (
              <InfoCard
                key={connection.id}
                title={<UserProfileLink userId={connection.id} userName={connection.name} />}
                description={connection.bio}
                contentTop={
                  <div className="flex items-center text-xs sm:text-sm text-muted-foreground mb-2">
                    <span className="break-words">
                      Last active: {formatDate(connection.lastActive)}
                    </span>
                  </div>
                }
                actions={
                  connection.status === 'connected' && connection.chatThreadId ? (
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      data-testid={`message-btn-${connection.id}`}
                      onClick={() => {
                        setSelectedThreadId(connection.chatThreadId!);
                        navigate('/chat');
                      }}
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Message
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      data-testid={`message-btn-${connection.id}`}
                      disabled
                    >
                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Message
                    </Button>
                  )
                }
                data-testid={`connection-card-${connection.id}`}
              />
            ))}
          </div>

          {filteredConnections.length === 0 && (
            <div className="text-center py-12" data-testid="connections-empty-state">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No connections found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="incoming" data-testid="tab-content-incoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingRequests.map((request) => {
              const fromUser = allUsers.find((u) => u.id === request.fromUserId);
              return (
                <InfoCard
                  key={request.fromUserId + request.toUserId + request.date}
                  title={
                    <UserProfileLink
                      userId={request.fromUserId}
                      userName={fromUser?.name || 'Unknown'}
                    />
                  }
                  description={request.message}
                  headerRight={
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(request.date))}
                    </span>
                  }
                  actions={
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 text-xs sm:text-sm"
                        data-testid={`accept-btn-${request.fromUserId}`}
                        onClick={() => handleAcceptRequest(request)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm"
                        data-testid={`decline-btn-${request.fromUserId}`}
                        onClick={() => handleDeclineRequest(request)}
                      >
                        Decline
                      </Button>
                    </div>
                  }
                  data-testid={`incoming-request-card-${request.fromUserId}`}
                />
              );
            })}
          </div>
          {incomingRequests.length === 0 && (
            <div className="text-center py-12" data-testid="incoming-empty-state">
              <p className="text-muted-foreground">No incoming requests.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="outgoing" data-testid="tab-content-outgoing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outgoingRequests.map((request) => {
              const toUser = allUsers.find((u) => u.id === request.toUserId);
              return (
                <InfoCard
                  key={request.fromUserId + request.toUserId + request.date}
                  title={
                    <UserProfileLink
                      userId={request.toUserId}
                      userName={toUser?.name || 'Unknown'}
                    />
                  }
                  description={request.message}
                  headerRight={
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(request.date))}
                    </span>
                  }
                  actions={
                    <Button
                      variant="outline"
                      className="flex-1 text-xs sm:text-sm"
                      disabled
                      data-testid={`pending-btn-${request.toUserId}`}
                    >
                      Pending
                    </Button>
                  }
                  data-testid={`outgoing-request-card-${request.toUserId}`}
                />
              );
            })}
          </div>
          {outgoingRequests.length === 0 && (
            <div className="text-center py-12" data-testid="outgoing-empty-state">
              <p className="text-muted-foreground">No outgoing requests.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedUserId && (
        <UserProfileDialog
          userId={selectedUserId!}
          isOpen={profileDialog.isOpen}
          onClose={profileDialog.close}
        />
      )}
    </div>
  );
};

export default ConnectionsPage;
