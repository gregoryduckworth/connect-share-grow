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

interface UserActivateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onActivate: (id: string, message: string) => void;
}

const UserActivateDialog = ({
  isOpen,
  onClose,
  user,
  onActivate,
}: UserActivateDialogProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [user, isOpen]);

  const handleActivate = () => {
    if (user && message.trim()) {
      onActivate(user.id, message.trim());
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Activate User</DialogTitle>
          <DialogDescription>
            Please provide a message for reactivating{" "}
            <span className="font-semibold">{user.name}</span>.
            <br />A notification will be sent to the user with this message.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="activate-message">Message</Label>
          <Textarea
            id="activate-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter activation message..."
            rows={4}
            required
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleActivate}
            disabled={!message.trim()}
            type="button"
          >
            Activate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivateDialog;
