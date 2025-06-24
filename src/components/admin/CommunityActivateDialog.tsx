import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Community {
  id: string;
  name: string;
  description: string;
  moderators: string[];
}

interface CommunityActivateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community | null;
  onActivate: (id: string, message: string) => void;
}

const CommunityActivateDialog = ({
  isOpen,
  onClose,
  community,
  onActivate,
}: CommunityActivateDialogProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [community, isOpen]);

  const handleActivate = () => {
    if (community && message.trim()) {
      onActivate(community.id, message.trim());
      onClose();
    }
  };

  if (!community) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Activate Community</DialogTitle>
          <DialogDescription>
            Please provide a message for activating{" "}
            <span className="font-semibold">{community.name}</span>.<br />A
            notification will be sent to all moderators of this community with
            this message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="activate-message">Activation Message</Label>
            <Textarea
              id="activate-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why this community is being re-activated or provide any important info..."
              rows={3}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleActivate}
            disabled={!message.trim()}
          >
            Activate Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityActivateDialog;
