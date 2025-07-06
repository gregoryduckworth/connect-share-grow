
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
  postTitle?: string;
  contentType?: "post" | "comments";
  lockReason?: string;
  setLockReason?: (reason: string) => void;
  title?: string;
  description?: string;
  lockReasonLabel?: string;
}

const LockPostDialog = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle = "this content",
  contentType = "post",
  lockReason,
  setLockReason,
  title,
  description,
  lockReasonLabel,
}: LockPostDialogProps) => {
  const [internalReason, setInternalReason] = useState("");
  const { toast } = useToast();

  const currentReason = lockReason || internalReason;
  const setCurrentReason = setLockReason || setInternalReason;

  const handleConfirm = () => {
    if (!currentReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for locking this content.",
      });
      return;
    }

    onConfirm(currentReason);
    setCurrentReason("");
    onClose();
  };

  const handleClose = () => {
    setCurrentReason("");
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
            {title || `Lock ${contentType === "post" ? "Post" : "Comments"}`}
          </DialogTitle>
          <DialogDescription>
            {description || 
              `You are about to lock ${contentType === "post" ? "the post" : "comments for"}: "${postTitle}". The author will be notified of this action.`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              {lockReasonLabel || "Reason for locking *"}
            </Label>
            <Textarea
              id="reason"
              placeholder={`Please provide a reason for locking this ${contentType}...`}
              value={currentReason}
              onChange={(e) => setCurrentReason(e.target.value)}
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
