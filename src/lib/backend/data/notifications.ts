import { Notification } from "@/lib/types";
import { USERS_DATA } from "./users";
import { POSTS_DATA } from "./posts";
import { COMMUNITIES_DATA } from "./communities";

export const NOTIFICATIONS_DATA: Notification[] = [
  {
    id: "n1a2b3c4-d5e6-f789-0123-456789abcdef",
    type: "reply",
    title: "New reply to your post",
    message: "David Kim replied to your post about camera settings",
    timestamp: new Date("2024-01-25T15:45:00Z"),
    isRead: false,
    userId: USERS_DATA[0].id,
    postId: POSTS_DATA[0].id,
    communityId: COMMUNITIES_DATA[0].slug,
  },
  {
    id: "n2b3c4d5-e6f7-g890-1234-567890bcdefg",
    type: "mention",
    title: "You were mentioned",
    message: "Emma Wilson mentioned you in Tech Discussions",
    timestamp: new Date("2024-01-24T17:30:00Z"),
    isRead: false,
    userId: USERS_DATA[1].id,
    postId: POSTS_DATA[1].id,
    communityId: COMMUNITIES_DATA[1].slug,
  },
];
