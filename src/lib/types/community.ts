
import { Named, Identifiable } from './base';

// Community types
export interface CommunityBase extends Named {
  id: string;
  description: string;
  tags: string[];
}

export interface Community extends CommunityBase {
  slug: string;
  memberCount: number;
  postCount: number;
  category: string;
  lastActivity: Date;
  createdBy?: string;
  requestedAt?: Date;
  status?: 'active' | 'pending' | 'suspended';
  isJoined?: boolean; // Added for UI join/leave logic
  moderators?: string[]; // Added for admin communities page
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
