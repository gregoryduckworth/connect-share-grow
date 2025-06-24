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

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserSuspendDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSuspend: (id: string, reason: string) => void;
}

const UserSuspendDialog = ({
  isOpen,
  onClose,
  user,
  onSuspend,
}: UserSuspendDialogProps) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason("");
  }, [user, isOpen]);

  const handleSuspend = () => {
    if (user && reason.trim()) {
      onSuspend(user.id, reason.trim());
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Suspend User</DialogTitle>
          <DialogDescription>
            Please provide a reason for suspending{" "}
            <span className="font-semibold">{user.name}</span>.
            <br />A notification will be sent to the user with the reason for
            suspension.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="suspend-reason">Reason</Label>
          <Textarea
            id="suspend-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter suspension reason..."
            rows={4}
            required
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSuspend}
            disabled={!reason.trim()}
            type="button"
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserSuspendDialog;
