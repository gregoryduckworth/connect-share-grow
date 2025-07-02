
import { USERS_DATA } from "../data/users";
import { COMMUNITIES_DATA } from "../data/communities";
import { POSTS_DATA } from "../data/posts";
import { REPORTS_DATA } from "../data/reports";
import type {
  AdminRole,
  AdminRoleUser,
  AnalyticsCommunity,
  PlatformStats,
  ActivityDataPoint,
  AnalyticsDataPoint,
} from "@/lib/types";

export const adminService = {
  getAdminRoles: async (): Promise<AdminRole[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const mapUser = (u: any): AdminRoleUser => ({
      id: u.id,
      name: u.name,
      email: u.email,
      joinDate: u.createdAt,
      communities: undefined,
    });
    return [
      {
        name: "Admin",
        description: "Full platform access and control",
        permissions: [
          "Manage users",
          "Manage communities",
          "Access analytics",
          "System settings",
        ],
        userCount: USERS_DATA.filter((u) => u.role === "admin").length,
        users: USERS_DATA.filter((u) => u.role === "admin").map(mapUser),
        icon: "admin",
        color: "bg-red-500",
      },
      {
        name: "Moderator",
        description: "Community moderation and user management",
        permissions: [
          "Moderate content",
          "Manage community posts",
          "Handle reports",
        ],
        userCount: USERS_DATA.filter((u) => u.role === "moderator").length,
        users: USERS_DATA.filter((u) => u.role === "moderator").map(mapUser),
        icon: "moderator",
        color: "bg-blue-500",
      },
      {
        name: "User",
        description: "Standard user access",
        permissions: ["Create posts", "Join communities", "Comment and like"],
        userCount: USERS_DATA.filter((u) => u.role === "user").length,
        users: USERS_DATA.filter((u) => u.role === "user")
          .slice(0, 5)
          .map(mapUser),
        icon: "user",
        color: "bg-green-500",
      },
    ];
  },

  getPendingAdminRoleChanges: async (): Promise<AdminRole[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },

  getAnalyticsCommunities: async (): Promise<AnalyticsCommunity[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return COMMUNITIES_DATA.map((c) => ({
      name: c.name,
      members: c.memberCount,
      posts: c.postCount,
      comments: c.postCount * 2,
      activity: Math.floor(Math.random() * 100),
    }));
  },

  getPlatformStats: async (): Promise<PlatformStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalUsers: USERS_DATA.length,
      totalCommunities: COMMUNITIES_DATA.length,
      totalPosts: POSTS_DATA.length,
      totalReports: REPORTS_DATA.length,
    };
  },

  getActivityData: async (): Promise<ActivityDataPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      { name: "Mon", posts: 12, users: 24 },
      { name: "Tue", posts: 19, users: 32 },
      { name: "Wed", posts: 15, users: 28 },
      { name: "Thu", posts: 22, users: 45 },
      { name: "Fri", posts: 18, users: 38 },
      { name: "Sat", posts: 25, users: 52 },
      { name: "Sun", posts: 20, users: 41 },
    ];
  },

  getSizeDistribution: async (): Promise<AnalyticsDataPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      { name: "Small (1-100)", value: 45, color: "#8884d8" },
      { name: "Medium (101-500)", value: 30, color: "#82ca9d" },
      { name: "Large (501-1000)", value: 20, color: "#ffc658" },
      { name: "Very Large (1000+)", value: 5, color: "#ff8042" },
    ];
  },
};

// Mock pending moderator role changes
export const mockPendingModeratorRoleChanges = [
  {
    id: "mod1a2b3-c4d5-e6f7-g890-123456789abc",
    user: {
      id: "e5f6g7h8-i9j0-1234-5678-901234efghij",
      name: "David Kim",
      email: "david.kim@example.com",
      joinDate: new Date("2024-01-12T11:30:00Z"),
      role: "user",
      status: "active",
      communities: ["entrepreneurs-united"],
    },
    requestedBy: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    requestedAt: new Date("2024-01-20T14:15:00Z"),
    newRole: "moderator",
    communityName: "Entrepreneurs United",
    status: "pending",
  },
];
