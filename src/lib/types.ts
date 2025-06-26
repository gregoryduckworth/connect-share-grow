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

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  category: string;
  tags: string[];
  isJoined: boolean;
  lastActivity: Date;
  createdBy?: string;
  requestedAt?: Date;
  status?: "active" | "pending" | "suspended";
  moderators?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "moderator" | "admin";
  createdAt: Date;
  isActive: boolean;
  avatar?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: Date;
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

export interface Report {
  id: string;
  type: "post" | "reply" | "user";
  reportedBy: string;
  reportedAt: Date;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  content: string;
  postId?: string;
  replyId?: string;
  userId?: string;
  communityId?: string;
  originalContent?: string;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  requestedAt: Date;
  respondedAt?: Date;
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

// Types for UI-specific community and post data
export interface CommunityDetail {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  tags: string[];
  isMember: boolean;
  isModerator: boolean;
  moderators: Array<{
    id: string;
    name: string;
    role: string;
    joinedAsModAt: Date;
  }>;
  rules: string[];
}

export interface CommunityPost {
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
}
