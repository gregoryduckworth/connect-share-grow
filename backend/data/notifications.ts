
import { Notification } from "@/lib/types";

export const NOTIFICATIONS_DATA: Notification[] = [
  {
    id: "n1a2b3c4-d5e6-f789-0123-456789abcdef",
    type: "reply",
    title: "New reply to your post",
    message: "David Kim replied to your post about camera settings",
    timestamp: new Date("2024-01-25T15:45:00Z"),
    isRead: false,
    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
  },
  {
    id: "n2b3c4d5-e6f7-g890-1234-567890bcdefg",
    type: "mention",
    title: "You were mentioned",
    message: "Emma Wilson mentioned you in Tech Discussions",
    timestamp: new Date("2024-01-24T17:30:00Z"),
    isRead: false,
    userId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    communityId: "tech-discussions",
  },
];
