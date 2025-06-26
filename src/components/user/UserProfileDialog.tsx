import { useState } from "react";
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
import { MapPin, Calendar, Globe, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface UserProfileDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  showConnectionButton?: boolean;
}

const UserProfileDialog = ({
  userId,
  isOpen,
  onClose,
  currentUserId,
  showConnectionButton = true,
}: UserProfileDialogProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionPending, setConnectionPending] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  // Mock user data - in a real app, this would come from an API based on userId
  const user = {
    id: userId,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    bio: "Professional photographer and community moderator. Passionate about capturing life's beautiful moments.",
    location: "San Francisco, CA",
    website: "https://sarahjohnson.photography",
    joinDate: new Date(2023, 0, 15),
    postCount: 147,
    connectionCount: 89,
    communityCount: 12,
    interests: ["Photography", "Travel", "Art", "Nature", "Community Building"],
    recentActivity: [
      "Posted in Photography Enthusiasts",
      "Joined Travel Stories community",
      "Connected with Mike Chen",
    ],
  };

  const isOwnProfile = userId === currentUserId;

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
                    <span>Joined {user.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {user.website && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-4">
                    <Globe className="h-4 w-4" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                )}

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
                      {user.postCount}
                    </div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-social-primary">
                      {user.connectionCount}
                    </div>
                    <div className="text-sm text-gray-500">Connections</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-social-primary">
                      {user.communityCount}
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
                {user.interests.map((interest, index) => (
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
                {user.recentActivity.map((activity, index) => (
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
