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

export interface PendingAdminRoleChange {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "moderator" | "admin";
  };
  requestedBy: string;
  requestedAt: Date;
  newRole: "user" | "moderator" | "admin";
}

export const adminService = {
  getAdminRoles: async (): Promise<AdminRole[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    type UserData = {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
      role: "user" | "moderator" | "admin";
    };

    const mapUser = (u: UserData): AdminRoleUser => ({
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

  getPendingAdminRoleChanges: async (): Promise<PendingAdminRoleChange[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pendingChanges: PendingAdminRoleChange[] = USERS_DATA.filter(
      (u) => u.role === "user"
    )
      .slice(0, 1)
      .map((user) => {
        // Pick an admin as the requester
        const admin = USERS_DATA.find((u) => u.role === "admin");
        return {
          id: `pending-role-change-${user.id}`,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          requestedBy: admin?.name ?? "Unknown Admin",
          requestedAt: new Date("2024-01-20T14:15:00Z"),
          newRole: "moderator",
        };
      });
    return pendingChanges;
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

// Dynamically generate mock pending moderator role changes from USERS_DATA and COMMUNITIES_DATA
export const mockPendingModeratorRoleChanges = USERS_DATA.filter(
  (u) => u.role === "user"
)
  .slice(0, 2)
  .map((user, idx) => {
    const admin = USERS_DATA.find((u) => u.role === "admin");
    const community = COMMUNITIES_DATA[idx % COMMUNITIES_DATA.length];
    return {
      id: `pending-mod-role-${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.createdAt,
        role: user.role,
        status: user.isActive ? "active" : "inactive",
        communities: user.communities || [],
      },
      requestedBy: admin?.name ?? "Unknown Admin",
      requestedAt: new Date("2024-01-20T14:15:00Z"),
      newRole: "moderator",
      communityName: community.name,
      status: "pending",
    };
  });
