import { Reply } from "@/lib/types";
import { USERS_DATA } from "./users";
import { POSTS_DATA } from "./posts";

export const REPLIES_DATA: Reply[] = [
  {
    id: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    content:
      "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    author: USERS_DATA[0].id,
    postId: POSTS_DATA[0].id,
    createdAt: new Date("2024-01-25T15:45:00Z"),
    likes: 8,
    parentReplyId: null,
  },
  {
    id: "r2b3c4d5-e6f7-g890-1234-567890bcdefg",
    content:
      "RSCs are game-changing! We've implemented them in our production app and saw a 40% reduction in bundle size.",
    author: USERS_DATA[1].id,
    postId: POSTS_DATA[1].id,
    createdAt: new Date("2024-01-24T17:30:00Z"),
    likes: 12,
    parentReplyId: null,
  },
  {
    id: "r3c4d5e6-f7g8-h901-2345-678901cdefgh",
    content:
      "Amazing transformation! What was your biggest challenge during the 30 days?",
    author: USERS_DATA[2].id,
    postId: POSTS_DATA[2].id,
    createdAt: new Date("2024-01-23T14:20:00Z"),
    likes: 3,
    parentReplyId: null,
  },
  {
    id: "reply-3",
    author: USERS_DATA[0].id, // or a new user if desired
    content: "This is a 3rd level reply for visual testing.",
    createdAt: new Date(),
    likes: 1,
    parentReplyId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    postId: POSTS_DATA[0].id,
  },
];
