
export interface Post {
  isLiked: boolean;
  id: string;
  title: string;
  content: string;
  author: string;
  communityId: string;
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
  isLocked: boolean;
  parentReplyId?: string | null;
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
  userName?: string;
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
  userName?: string;
}

export interface PostData {
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
  userName?: string;
}

export interface CommunityPostProps {
  post: PostData;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onPin?: (postId: string) => void;
  onLock?: (postId: string, reason: string) => void;
  onUnlock?: (postId: string) => void;
  onLockComments?: (postId: string, reason: string) => void;
  onUnlockComments?: (postId: string) => void;
  isModerator?: boolean;
  showPreview?: boolean;
  onShowUserProfile?: (userId: string) => void;
  communitySlug: string;
}
