
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PendingCommunity {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdBy: string;
  requestedAt: Date;
}

interface CommunityApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: PendingCommunity | null;
  onApprove: (id: string, updatedCommunity: { name: string; description: string }) => void;
}

const CommunityApprovalDialog = ({ 
  isOpen, 
  onClose, 
  community, 
  onApprove 
}: CommunityApprovalDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when community changes
  useState(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
    }
  });

  const handleApprove = () => {
    if (community) {
      onApprove(community.id, { name, description });
      onClose();
    }
  };

  if (!community) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Approve Community</DialogTitle>
          <DialogDescription>
            Review and edit the community details before approval.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Community Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter community description"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Created By</Label>
            <p className="text-sm text-muted-foreground">{community.createdBy}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={!name.trim() || !description.trim()}>
            Approve Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityApprovalDialog;
