
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { ReportBase } from "@/lib/types";

const REPORT_REASONS = [
  "Spam",
  "Harassment or bullying",
  "Hate speech",
  "False information",
  "Off-topic",
  "Other",
];

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: (report: ReportBase) => void;
  context: {
    type: "post" | "reply";
    postId: string;
    replyId?: string;
    communityId?: string;
    originalContent?: string;
  };
  reportedBy: string;
}

export default function ReportModal({
  open,
  onClose,
  onSubmitted,
  context,
  reportedBy,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason && !otherReason) {
      setError("Please select or enter a reason.");
      return;
    }
    setSubmitting(true);
    setError("");
    
    const finalReason = reason === "Other" ? otherReason : reason;
    const contentId = context.type === "post" ? context.postId : context.replyId || "";
    const contentPreview = context.originalContent?.substring(0, 100) || "";
    
    const reportData = {
      contentType: context.type,
      contentId,
      contentPreview,
      reportedBy,
      reason: finalReason,
      content: context.originalContent || "",
      postId: context.type === "post" ? context.postId : undefined,
      replyId: context.type === "reply" ? context.replyId : undefined,
      communityId: context.communityId || "", // Ensure it's always a string
    };
    
    try {
      const report = await api.submitReport(reportData);
      setSubmitting(false);
      onSubmitted?.(report);
      onClose();
    } catch (e) {
      setError("Failed to submit report. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Report {context.type === "post" ? "Post" : "Reply"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="font-medium">Reason for reporting:</div>
          <div className="flex flex-col gap-2">
            {REPORT_REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="report-reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  disabled={submitting}
                />
                {r}
              </label>
            ))}
          </div>
          {reason === "Other" && (
            <Textarea
              placeholder="Describe the issue..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              disabled={submitting}
              className="mt-2"
            />
          )}
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
