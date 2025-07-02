
import { Community } from "@/lib/types";

export const COMMUNITIES_DATA: Community[] = [
  {
    slug: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "A community for photographers of all skill levels to share tips, techniques, and showcase their work.",
    memberCount: 1247,
    postCount: 89,
    category: "Creative Arts",
    tags: ["photography", "art", "creative", "digital"],
    isJoined: true,
    lastActivity: new Date("2024-01-25T14:30:00Z"),
    createdBy: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    status: "active",
    moderators: ["b2c3d4e5-f6g7-8901-2345-678901bcdefg"],
  },
  {
    slug: "tech-discussions",
    name: "Tech Discussions",
    description:
      "Discuss the latest trends in technology, programming languages, and software development.",
    memberCount: 2156,
    postCount: 234,
    category: "Technology",
    tags: ["tech", "programming", "software", "development"],
    isJoined: true,
    lastActivity: new Date("2024-01-24T16:20:00Z"),
    createdBy: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    status: "active",
    moderators: [
      "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
      "d4e5f6g7-h8i9-0123-4567-890123defghi",
    ],
  },
  {
    slug: "fitness-wellness",
    name: "Fitness & Wellness",
    description:
      "Share workout routines, nutrition tips, and wellness advice for a healthier lifestyle.",
    memberCount: 892,
    postCount: 156,
    category: "Health & Fitness",
    tags: ["fitness", "health", "wellness", "nutrition"],
    isJoined: false,
    lastActivity: new Date("2024-01-23T12:45:00Z"),
    createdBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    status: "active",
    moderators: ["c3d4e5f6-g7h8-9012-3456-789012cdefgh"],
  },
  {
    slug: "entrepreneurs-united",
    name: "Entrepreneurs United",
    description:
      "Connect with fellow entrepreneurs, share business insights, and grow your network.",
    memberCount: 1834,
    postCount: 167,
    category: "Business",
    tags: ["entrepreneurship", "business", "startups", "networking"],
    isJoined: false,
    lastActivity: new Date("2024-01-21T09:30:00Z"),
    createdBy: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    status: "active",
    moderators: ["e5f6g7h8-i9j0-1234-5678-901234efghij"],
  },
];
