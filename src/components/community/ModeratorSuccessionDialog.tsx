
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users } from "lucide-react";

interface CommunityMember {
  id: string;
  name: string;
  avatarUrl?: string;
  joinDate: Date;
  isBanned: boolean;
}

interface ModeratorSuccessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  members: CommunityMember[];
  onSelectNewModerator: (userId: string) => void;
  communityName: string;
}

const ModeratorSuccessionDialog = ({
  isOpen,
  onClose,
  members,
  onSelectNewModerator,
  communityName
}: ModeratorSuccessionDialogProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const eligibleMembers = members.filter(member => !member.isBanned);

  const handleConfirm = () => {
    if (selectedMember) {
      onSelectNewModerator(selectedMember);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Choose New Moderator
          </DialogTitle>
          <DialogDescription>
            You are the last moderator of "{communityName}". Please select a new moderator before leaving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {eligibleMembers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Users className="mx-auto h-8 w-8 mb-2" />
              <p>No eligible members to promote</p>
            </div>
          ) : (
            eligibleMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedMember === member.id
                    ? "border-social-primary bg-social-primary/10"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedMember(member.id)}
              >
                <Avatar className="h-8 w-8 bg-social-primary text-white">
                  <div className="flex h-full w-full items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Joined {new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      year: 'numeric'
                    }).format(member.joinDate)}
                  </div>
                </div>
                {selectedMember === member.id && (
                  <Badge className="bg-social-primary">Selected</Badge>
                )}
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedMember}
            className="bg-social-primary hover:bg-social-secondary"
          >
            Confirm & Leave Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModeratorSuccessionDialog;
