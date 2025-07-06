
import { User } from "./user";
import { Report } from "./reports";

// Admin/Moderation
export interface PendingAdminRoleChange {
  id: string;
  user: Pick<User, "id" | "name" | "email" | "role">;
  requestedBy: string;
  requestedAt: Date;
  newRole: User["role"];
  status: "pending" | "approved" | "rejected";
  communityName?: string;
}

export interface Moderator {
  id: string;
  name: string;
  role: string;
  joinedAsModAt: Date;
  actionsThisMonth: number;
}

export interface CommunityAnalytics {
  totalMembers: number;
  totalPosts: number;
  postsThisWeek: number;
  activeMembers: number;
  reportsThisWeek: number;
}

export interface AdminNotification {
  id: string;
  type:
    | "community_approval"
    | "user_report"
    | "moderator_inactive"
    | "system_alert";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}
