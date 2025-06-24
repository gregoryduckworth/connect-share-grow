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

interface CommunityRejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: PendingCommunity | null;
  onReject: (id: string, feedback: string) => void;
}

const CommunityRejectionDialog = ({
  isOpen,
  onClose,
  community,
  onReject,
}: CommunityRejectionDialogProps) => {
  const [feedback, setFeedback] = useState("");

  const handleReject = () => {
    if (community) {
      onReject(community.id, feedback);
      setFeedback("");
      onClose();
    }
  };

  if (!community) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reject Community</DialogTitle>
          <DialogDescription>
            Provide feedback to the community creator about why "
            {community.name}" is being rejected.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Community Name</Label>
            <div className="font-medium text-base bg-muted/50 rounded px-2 py-1">
              {community.name}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <div className="text-sm bg-muted/50 rounded px-2 py-1 text-muted-foreground">
              {community.description}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback">Rejection Reason</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this community request is being rejected..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={!feedback.trim()}
          >
            Reject Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityRejectionDialog;
