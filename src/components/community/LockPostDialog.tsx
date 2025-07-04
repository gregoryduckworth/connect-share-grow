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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Ban, Lock } from "lucide-react";

interface LockPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  postTitle: string;
  contentType: "post" | "comments";
}

const LockPostDialog = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  contentType,
}: LockPostDialogProps) => {
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for locking this content.",
      });
      return;
    }

    onConfirm(reason);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {contentType === "post" ? (
              <Lock className="h-5 w-5" />
            ) : (
              <Ban className="h-5 w-5" />
            )}
            Lock {contentType === "post" ? "Post" : "Comments"}
          </DialogTitle>
          <DialogDescription>
            You are about to lock{" "}
            {contentType === "post" ? "the post" : "comments for"}: "{postTitle}
            ". The author will be notified of this action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for locking *</Label>
            <Textarea
              id="reason"
              placeholder={`Please provide a reason for locking this ${contentType}...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              This reason will be visible to the post author and other
              moderators.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="destructive">
            {contentType === "post" ? (
              <Lock className="h-4 w-4 mr-2" />
            ) : (
              <Ban className="h-4 w-4 mr-2" />
            )}
            Lock {contentType === "post" ? "Post" : "Comments"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LockPostDialog;
