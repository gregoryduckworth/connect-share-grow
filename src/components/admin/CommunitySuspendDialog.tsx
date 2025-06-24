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

interface CommunitySuspendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community | null;
  onSuspend: (id: string, reason: string) => void;
}

const CommunitySuspendDialog = ({
  isOpen,
  onClose,
  community,
  onSuspend,
}: CommunitySuspendDialogProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason("");
  }, [community, isOpen]);

  const handleSuspend = () => {
    if (community && reason.trim()) {
      onSuspend(community.id, reason.trim());
      onClose();
    }
  };

  if (!community) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Suspend Community</DialogTitle>
          <DialogDescription>
            Please provide a reason for suspending{" "}
            <span className="font-semibold">{community.name}</span>.<br />A
            notification will be sent to all moderators of this community with
            the reason for suspension.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="suspend-reason">Reason for Suspension</Label>
            <Textarea
              id="suspend-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this community is being suspended..."
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
            variant="destructive"
            onClick={handleSuspend}
            disabled={!reason.trim()}
          >
            Suspend Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommunitySuspendDialog;
