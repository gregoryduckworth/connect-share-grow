
import type { ReportBase as Report } from "@/lib/types";

export const REPORTS_DATA: Report[] = [
  // Post report
  {
    id: "rep1a2b3-c4d5-e6f7-g890-123456789abc",
    contentType: "post",
    contentId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    contentPreview:
      "This post contains inappropriate language and violates community guidelines.",
    reportedBy: "Mike Rodriguez",
    createdAt: new Date("2024-01-24T10:30:00Z"),
    reason: "Inappropriate content",
    status: "pending",
    content:
      "This post contains inappropriate language and violates community guidelines.",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
    originalContent: {
      title: "Best Camera Settings for Golden Hour Photography",
      community: "Photography Enthusiasts",
      author: "Alex Johnson",
      fullText:
        "Golden hour provides the most beautiful natural lighting for photography...",
    },
    originalLink: "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef",
  },
  // Reply report
  {
    id: "rep2b3c4-d5e6-f789-0123-456789abcdef",
    contentType: "reply",
    contentId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    contentPreview: "This reply is spam and not relevant to the discussion.",
    reportedBy: "Alex Johnson",
    createdAt: new Date("2024-01-25T11:00:00Z"),
    reason: "Spam reply",
    status: "reviewed",
    content: "This reply is spam and not relevant to the discussion.",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    replyId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
    originalContent: {
      title: "Best Camera Settings for Golden Hour Photography",
      author: "David Kim",
      fullText:
        "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    },
    originalLink: "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef#reply-r1a2b3c4-d5e6-f789-0123-456789abcdef",
  },
  // User report
  {
    id: "rep3c4d5-e6f7-g890-1234-567890bcdefg",
    contentType: "user",
    contentId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    contentPreview:
      "User has been sending harassing messages to other members.",
    reportedBy: "Sarah Chen",
    createdAt: new Date("2024-01-26T09:15:00Z"),
    reason: "Harassment",
    status: "resolved",
    content: "User has been sending harassing messages to other members.",
    userId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    communityId: "photography-enthusiasts",
    originalContent: {
      title: "David Kim",
      author: "david.kim@example.com",
      fullText: "Direct message content here.",
    },
    originalLink: "/user/e5f6g7h8-i9j0-1234-5678-901234efghij",
  },
];
