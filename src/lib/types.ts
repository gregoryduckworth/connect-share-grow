// Base types for reuse
export interface Identifiable {
  id: string;
}
export interface Named {
  name: string;
}
export interface Emailable {
  email: string;
}

// User types
export interface User extends Identifiable, Named, Emailable {
  role: "user" | "moderator" | "admin";
  createdAt: Date;
  isActive: boolean;
  isEmailVerified: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  language?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: Date;
}

export interface AdminRoleUser extends Identifiable, Named, Emailable {
  joinDate: Date;
  communities?: string[];
}

export type AdminRole = {
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  users: AdminRoleUser[];
  icon: string;
  color: string;
};

// Community types
export interface CommunityBase extends Named {
  description: string;
  tags: string[];
}

export interface Community extends CommunityBase {
  slug: string;
  memberCount: number;
  postCount: number;
  category: string;
  isJoined: boolean;
  lastActivity: Date;
  createdBy?: string;
  requestedAt?: Date;
  status?: "active" | "pending" | "suspended";
  moderators?: string[];
}

export interface CommunityModerator extends Identifiable, Named {
  role: string;
  joinedAsModAt: Date;
}

export interface CommunityDetail extends CommunityBase {
  id: string;
  memberCount: number;
  postCount: number;
  isMember: boolean;
  isModerator: boolean;
  moderators: CommunityModerator[];
  rules: string[];
}

export interface CommunityPost extends Identifiable, Named {
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  commentsLocked: boolean;
  tags: string[];
  lockReason?: string;
  commentsLockReason?: string;
}

// Analytics types
export interface AnalyticsDataPoint extends Named {
  value: number;
  color?: string;
}

export interface AnalyticsCommunity extends Named {
  members: number;
  posts: number;
  comments?: number;
  activity?: number;
}

export interface ActivityDataPoint extends Named {
  posts: number;
  users: number;
}

// Report types - unified interface
export interface ReportBase extends Identifiable {
  contentType: "post" | "reply" | "user";
  contentId: string;
  contentPreview: string;
  reportedBy: string;
  createdAt: Date;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  content: string;
  postId?: string;
  replyId?: string;
  userId?: string;
  communityId?: string;
  originalContent?: {
    title?: string;
    community?: string;
    author?: string;
    fullText?: string;
  };
  originalLink?: string;
}

// Keep Report as alias for backward compatibility
export type Report = ReportBase;

export interface Post {
  isLiked: boolean;
  id: string;
  title: string;
  content: string;
  author: string;
  communityId: string;
  communityName: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isHot?: boolean;
  isLocked?: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  postId: string;
  createdAt: Date;
  likes: number;
  parentReplyId?: string | null;
}

export interface Notification {
  id: string;
  type:
    | "reply"
    | "comment"
    | "mention"
    | "system"
    | "connection_request"
    | "connection_accepted";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postId?: string;
  userId?: string;
  communityId?: string;
  connectionId?: string;
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

export interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
}

export interface PostDetailReply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  isLocked?: boolean;
  lockReason?: string;
  parentId?: string;
  replies: PostDetailReply[];
}

export interface PostDetailData {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  commentsLocked: boolean;
  tags: string[];
  lockReason?: string;
  commentsLockReason?: string;
  replies: PostDetailReply[];
  communityId: string;
  communityName: string;
}

export type PlatformStats = {
  totalUsers: number;
  totalCommunities: number;
  totalPosts: number;
  totalReports: number;
};
