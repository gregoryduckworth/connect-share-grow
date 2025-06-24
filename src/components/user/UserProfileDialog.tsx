
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Users, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface UserProfileDialogProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const UserProfileDialog = ({ userId, isOpen, onClose, currentUserId }: UserProfileDialogProps) => {
  const [connectionMessage, setConnectionMessage] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  // Mock user data based on userId
  const userProfile = {
    id: userId,
    name: `User ${userId.replace('user-', '').replace('-', ' ')}`,
    commonCommunities: ["Photography Enthusiasts", "Web Development", "Tech Discussions"],
    joinDate: new Date(2024, 3, 15)
  };

  const handleSendConnectionRequest = async () => {
    if (!connectionMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please include a message explaining why you'd like to connect.",
        variant: "destructive"
      });
      return;
    }

    setIsRequesting(true);
    try {
      await api.createConnectionRequest({
        fromUserId: currentUserId,
        toUserId: userProfile.id,
        fromUserName: "Current User",
        toUserName: userProfile.name,
        message: connectionMessage
      });

      toast({
        title: "Connection request sent",
        description: `Your connection request has been sent to ${userProfile.name}.`
      });

      setConnectionMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {userProfile.name}
          </DialogTitle>
          <DialogDescription>
            View profile and send a connection request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Username:</span>
                <span>{userProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Member since:</span>
                <span>{userProfile.joinDate.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Common Communities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Communities in Common
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProfile.commonCommunities.map((community, index) => (
                  <Badge key={index} variant="secondary">
                    {community}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connection Request */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send Connection Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder={`Hi ${userProfile.name}, I'd like to connect because...`}
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleSendConnectionRequest}
                disabled={isRequesting || !connectionMessage.trim()}
                className="w-full"
              >
                {isRequesting ? "Sending..." : "Send Connection Request"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
