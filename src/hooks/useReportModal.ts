import { useState, useCallback } from "react";

export type ReportContext = {
  type: "post" | "reply";
  postId: string;
  replyId?: string;
  communityId?: string;
  originalContent?: string;
} | null;

export function useReportModal() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContext, setReportContext] = useState<ReportContext>(null);

  const openReportModal = useCallback((context: ReportContext) => {
    setReportContext(context);
    setReportModalOpen(true);
  }, []);

  const closeReportModal = useCallback(() => {
    setReportModalOpen(false);
    setReportContext(null);
  }, []);

  return {
    reportModalOpen,
    reportContext,
    openReportModal,
    closeReportModal,
  };
}
