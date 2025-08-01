// Social App Types
export interface Connection {
  id: string;
  name: string;
  status: 'connected' | 'pending' | 'received';
  lastActive: Date;
  bio?: string;
}

export interface ConnectionRequest {
  fromUserId: string;
  toUserId: string;
  message: string;
  date: string;
}

export interface ConnectionData {
  userId: string;
  connections: Array<{
    id: string;
    status: 'connected' | 'pending' | 'received';
    lastActive: Date;
  }>;
}

export interface Notification {
  id: string;
  type: 'reply' | 'comment' | 'mention' | 'system' | 'connection_request' | 'connection_accepted';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postId?: string;
  userId?: string;
  communityId?: string;
  connectionId?: string;
}

export interface ChatMessage {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
}
