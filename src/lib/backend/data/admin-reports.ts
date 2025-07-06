
import { ReportBase } from "@/lib/types";

export const ADMIN_REPORTS_DATA: ReportBase[] = [
  {
    id: "report-1",
    contentType: "post",
    contentId: "post-123",
    contentPreview: "This post contains inappropriate language and violates community guidelines...",
    reportedBy: "user-456",
    createdAt: new Date(2024, 5, 20, 14, 30),
    reason: "Hate speech",
    status: "pending",
    content: "Offensive content that violates our community standards",
    communityId: "comm-1",
    originalContent: {
      title: "Controversial Post Title",
      community: "General Discussion",
      author: "problematic_user",
      fullText: "Full text of the reported post content..."
    },
    originalLink: "/post/post-123"
  },
  {
    id: "report-2",
    contentType: "reply",
    contentId: "reply-789",
    contentPreview: "Inappropriate language and harassment in this reply...",
    reportedBy: "user-789",
    createdAt: new Date(2024, 5, 19, 16, 45),
    reason: "Harassment",
    status: "reviewed",
    content: "Harassing content directed at another user",
    communityId: "comm-2",
    originalContent: {
      community: "Tech Talk",
      author: "toxic_commenter",
      fullText: "Full text of the reported reply content..."
    },
    originalLink: "/post/some-post#reply-789"
  },
  {
    id: "report-3",
    contentType: "user",
    contentId: "user-321",
    contentPreview: "User profile contains offensive bio and inappropriate username",
    reportedBy: "user-654",
    createdAt: new Date(2024, 5, 18, 10, 15),
    reason: "Inappropriate profile",
    status: "resolved",
    content: "User profile violation",
    communityId: "comm-1",
    originalContent: {
      author: "inappropriate_user",
      fullText: "User bio and profile information..."
    }
  }
];
