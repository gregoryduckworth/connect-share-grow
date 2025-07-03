import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { userService } from "@/lib/backend/services/userService";
import type { User } from "@/lib/types";

export interface UserProfileDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  showConnectionButton?: boolean;
}

const UserProfileDialog = ({
  userId,
  isOpen,
  onClose,
  showConnectionButton = true,
}: UserProfileDialogProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionPending, setConnectionPending] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userService.getUserById(userId).then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, [userId]);

  const handleSendConnectionRequest = () => {
    setShowRequestDialog(true);
  };

  const handleRequestSubmit = () => {
    if (!requestMessage.trim()) {
      setRequestError("A message is required to send a connection request.");
      return;
    }
    // Save to localStorage (append to array)
    const requests = JSON.parse(
      localStorage.getItem("connectionRequests") || "[]"
    );
    requests.push({
      id: user.id,
      name: user.name,
      message: requestMessage,
      date: new Date().toISOString(),
    });
    localStorage.setItem("connectionRequests", JSON.stringify(requests));
    setConnectionPending(true);
    setShowRequestDialog(false);
    setRequestMessage("");
    setRequestError("");
    toast({
      title: "Connection request sent",
      description: `Connection request sent to ${user.name}`,
    });
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="text-social-muted">Loading user profile...</div>
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

  const isOwnProfile = userId === currentUser?.id;

  // Fallbacks for missing fields (use type assertion to unknown, then index signature)
  const userUnknown = user as unknown as Record<string, unknown>;
  const postCount =
    typeof userUnknown.postCount === "number" ? userUnknown.postCount : 0;
  const connectionCount =
    typeof userUnknown.connectionCount === "number"
      ? userUnknown.connectionCount
      : 0;
  const communityCount =
    typeof userUnknown.communityCount === "number"
      ? userUnknown.communityCount
      : 0;
  const interests = Array.isArray(userUnknown.interests)
    ? (userUnknown.interests as string[])
    : [];
  const recentActivity = Array.isArray(userUnknown.recentActivity)
    ? (userUnknown.recentActivity as string[])
    : [];

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
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

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
                    <span>Joined {user.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-2">
                    {showConnectionButton && (
                      <>
                        {!isConnected && !connectionPending && (
                          <Button
                            onClick={handleSendConnectionRequest}
                            size="sm"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                        )}

                        {connectionPending && (
                          <Button variant="outline" size="sm" disabled>
                            Request Sent
                          </Button>
                        )}

                        {isConnected && (
                          <Button variant="outline" size="sm" disabled>
                            Connected
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-social-primary">
                      {postCount}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-social-primary">
                      {connectionCount}
                    </div>
                    <div className="text-sm text-gray-500">Connections</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-social-primary">
                      {communityCount}
                    </div>
                    <div className="text-sm text-gray-500">Communities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <div>
              <h3 className="font-semibold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recent Activity */}
            <div>
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 py-2 border-l-2 border-gray-200 pl-3"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connection Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please include a message with your connection request to{" "}
              <span className="font-semibold">{user.name}</span>.
            </p>
            <Textarea
              value={requestMessage}
              onChange={(e) => {
                setRequestMessage(e.target.value);
                setRequestError("");
              }}
              placeholder="Write a message..."
              rows={4}
              className="w-full"
              autoFocus
            />
            {requestError && (
              <div className="text-red-500 text-xs">{requestError}</div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
              >
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
