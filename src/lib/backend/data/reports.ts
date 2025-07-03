import type { ReportBase as Report } from "@/lib/types";
import { USERS_DATA } from "./users";
import { POSTS_DATA } from "./posts";
import { COMMUNITIES_DATA } from "./communities";
import { REPLIES_DATA } from "./replies";

export const REPORTS_DATA: Report[] = [
  // Post report
  {
    id: "rep1a2b3-c4d5-e6f7-g890-123456789abc",
    contentType: "post",
    contentId: POSTS_DATA[0].id,
    contentPreview:
      "This post contains inappropriate language and violates community guidelines.",
    reportedBy: USERS_DATA[0].id,
    createdAt: new Date("2024-01-24T10:30:00Z"),
    reason: "Inappropriate content",
    status: "pending",
    content:
      "This post contains inappropriate language and violates community guidelines.",
    communityId: COMMUNITIES_DATA[0].slug,
    originalContent: {
      title: "Best Camera Settings for Golden Hour Photography",
      community: "Photography Enthusiasts",
      author: "Alex Johnson",
      fullText:
        "Golden hour provides the most beautiful natural lighting for photography...",
    },
    originalLink:
      "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef",
  },
  // Reply report
  {
    id: "rep2b3c4-d5e6-f789-0123-456789abcdef",
    contentType: "reply",
    contentId: REPLIES_DATA[0].id,
    contentPreview: "This reply is spam and not relevant to the discussion.",
    reportedBy: USERS_DATA[0].id,
    createdAt: new Date("2024-01-25T11:00:00Z"),
    reason: "Spam reply",
    status: "reviewed",
    content: "This reply is spam and not relevant to the discussion.",
    communityId: COMMUNITIES_DATA[0].slug,
    originalContent: {
      title: "Best Camera Settings for Golden Hour Photography",
      author: "David Kim",
      fullText:
        "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    },
    originalLink:
      "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef#reply-r1a2b3c4-d5e6-f789-0123-456789abcdef",
  },
  // User report
  {
    id: "rep3c4d5-e6f7-g890-1234-567890bcdefg",
    contentType: "user",
    contentId: USERS_DATA[1].id,
    contentPreview:
      "User has been sending harassing messages to other members.",
    reportedBy: USERS_DATA[2].id,
    createdAt: new Date("2024-01-26T09:15:00Z"),
    reason: "Harassment",
    status: "resolved",
    content: "User has been sending harassing messages to other members.",
    communityId: COMMUNITIES_DATA[0].slug,
    originalContent: {
      title: "David Kim",
      author: "david.kim@example.com",
      fullText: "Direct message content here.",
    },
    originalLink: "/user/e5f6g7h8-i9j0-1234-5678-901234efghij",
  },
];
