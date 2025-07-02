
import { Reply } from "@/lib/types";

export const REPLIES_DATA: Reply[] = [
  {
    id: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    content:
      "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    createdAt: new Date("2024-01-25T15:45:00Z"),
    likes: 8,
    parentReplyId: null,
  },
  {
    id: "r2b3c4d5-e6f7-g890-1234-567890bcdefg",
    content:
      "RSCs are game-changing! We've implemented them in our production app and saw a 40% reduction in bundle size.",
    author: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    createdAt: new Date("2024-01-24T17:30:00Z"),
    likes: 12,
    parentReplyId: null,
  },
  {
    id: "r3c4d5e6-f7g8-h901-2345-678901cdefgh",
    content:
      "Amazing transformation! What was your biggest challenge during the 30 days?",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    postId: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
    createdAt: new Date("2024-01-23T14:20:00Z"),
    likes: 3,
    parentReplyId: null,
  },
];
