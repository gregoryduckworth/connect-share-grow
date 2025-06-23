
import { 
  Post, 
  Community, 
  User, 
  Reply, 
  Notification, 
  AdminNotification, 
  Report, 
  Connection, 
  ChatMessage 
} from './types';

// Mock data storage
const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "The Future of Web Development",
    content: "What do you think about the latest trends in web development? AI integration seems to be everywhere now.",
    author: "TechEnthusiast",
    communityId: "web-dev",
    communityName: "Web Development",
    createdAt: new Date(2024, 5, 22),
    likes: 45,
    replies: 23,
    isHot: true
  },
  {
    id: "post-2",
    title: "Best Photography Spots in the City",
    content: "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations.",
    author: "PhotographyPro",
    communityId: "photography",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 21),
    likes: 67,
    replies: 34,
    isHot: true
  },
  {
    id: "post-3",
    title: "Camera Gear Recommendations",
    content: "Looking for recommendations on the best camera gear for beginners. Any suggestions?",
    author: "NewPhotographer",
    communityId: "photography",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 20),
    likes: 23,
    replies: 12,
    isHot: false
  }
];

const mockCommunities: Community[] = [
  {
    id: "web-dev",
    name: "Web Development",
    description: "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    tags: ["JavaScript", "React", "Node.js"],
    isJoined: false,
    lastActivity: new Date(2024, 5, 21),
    status: "active",
    moderators: ["user-1"]
  },
  {
    id: "photography",
    name: "Photography Enthusiasts",
    description: "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    category: "Creative",
    tags: ["Photography", "Camera", "Editing"],
    isJoined: true,
    lastActivity: new Date(2024, 5, 22),
    status: "active",
    moderators: ["user-2"]
  }
];

const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: new Date(2024, 4, 15),
    isActive: true,
    bio: "Photography enthusiast and community moderator"
  },
  {
    id: "user-2",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "moderator",
    createdAt: new Date(2024, 3, 10),
    isActive: true
  },
  {
    id: "user-3",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "admin",
    createdAt: new Date(2024, 2, 5),
    isActive: true
  }
];

const mockReplies: Reply[] = [
  {
    id: "reply-1",
    content: "Great insights! I've been working with React for years and the new features are amazing.",
    author: "ReactDev",
    postId: "post-1",
    createdAt: new Date(2024, 5, 22, 10, 30),
    likes: 12
  },
  {
    id: "reply-2",
    content: "Thanks for sharing these spots! I'll definitely check them out this weekend.",
    author: "PhotoFan",
    postId: "post-2",
    createdAt: new Date(2024, 5, 21, 15, 45),
    likes: 8
  }
];

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "reply",
    title: "New reply to your post",
    message: "Alice Johnson replied to your post 'Golden Hour Landscape Tips'",
    timestamp: new Date(2024, 5, 20, 14, 30),
    isRead: false,
    postId: "post-2",
    communityId: "photography",
    userId: "user-2"
  },
  {
    id: "notif-2",
    type: "comment",
    title: "New comment on your post",
    message: "Bob Smith commented on your post 'Street Photography Ethics'",
    timestamp: new Date(2024, 5, 20, 12, 15),
    isRead: false,
    postId: "post-1",
    communityId: "web-dev",
    userId: "user-3"
  },
  {
    id: "notif-3",
    type: "mention",
    title: "You were mentioned",
    message: "Carol Davis mentioned you in a comment",
    timestamp: new Date(2024, 5, 19, 16, 45),
    isRead: true,
    postId: "post-3",
    communityId: "photography",
    userId: "user-1"
  }
];

const mockAdminNotifications: AdminNotification[] = [
  {
    id: "admin-notif-1",
    type: "community_approval",
    title: "New Community Pending Approval",
    message: "Tech Discussions community is awaiting approval",
    timestamp: new Date(2024, 5, 20, 16, 30),
    isRead: false,
    priority: "medium"
  },
  {
    id: "admin-notif-2",
    type: "user_report",
    title: "New User Report",
    message: "User reported for inappropriate content in Photography community",
    timestamp: new Date(2024, 5, 20, 15, 45),
    isRead: false,
    priority: "high"
  }
];

const mockReports: Report[] = [
  {
    id: "report-1",
    type: "post",
    reportedBy: "user-1",
    reportedAt: new Date(2024, 5, 20),
    reason: "Spam content",
    status: "pending",
    content: "This is inappropriate spam content",
    postId: "post-1",
    communityId: "web-dev",
    originalContent: "Check out this amazing new framework that will revolutionize web development!"
  },
  {
    id: "report-2",
    type: "reply",
    reportedBy: "user-2",
    reportedAt: new Date(2024, 5, 19),
    reason: "Harassment",
    status: "reviewed",
    content: "Harassing comment targeting another user",
    replyId: "reply-1",
    postId: "post-2",
    communityId: "photography",
    originalContent: "Your photos are terrible and you should stop posting here."
  }
];

const mockConnections: Connection[] = [
  {
    id: "conn-1",
    fromUserId: "user-1",
    toUserId: "user-2",
    fromUserName: "John Doe",
    toUserName: "Alice Johnson",
    message: "Hi! I'd love to connect and discuss photography techniques.",
    status: "accepted",
    requestedAt: new Date(2024, 5, 15),
    respondedAt: new Date(2024, 5, 16)
  },
  {
    id: "conn-2",
    fromUserId: "user-3",
    toUserId: "user-1",
    fromUserName: "Bob Smith",
    toUserName: "John Doe",
    message: "Would like to connect for potential collaboration on web projects.",
    status: "pending",
    requestedAt: new Date(2024, 5, 20)
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    connectionId: "conn-1",
    senderId: "user-1",
    content: "Hey Alice! Thanks for accepting my connection request.",
    sentAt: new Date(2024, 5, 16, 10, 0),
    isRead: true
  },
  {
    id: "msg-2",
    connectionId: "conn-1",
    senderId: "user-2",
    content: "No problem! Looking forward to sharing photography tips.",
    sentAt: new Date(2024, 5, 16, 10, 15),
    isRead: true
  }
];

// API functions
export const api = {
  // Posts
  async getPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPosts), 500);
    });
  },

  async getHotPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPosts.filter(p => p.isHot).slice(0, 10)), 500);
    });
  },

  async getPost(id: string): Promise<Post | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPosts.find(p => p.id === id) || null), 500);
    });
  },

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'replies'>): Promise<Post> {
    return new Promise((resolve) => {
      const newPost: Post = {
        ...post,
        id: `post-${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
        replies: 0
      };
      mockPosts.push(newPost);
      setTimeout(() => resolve(newPost), 500);
    });
  },

  // Communities
  async getCommunities(): Promise<Community[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCommunities), 500);
    });
  },

  async getCommunity(id: string): Promise<Community | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCommunities.find(c => c.id === id) || null), 500);
    });
  },

  // Users
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  async getUser(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers.find(u => u.id === id) || null), 500);
    });
  },

  // Replies
  async getReplies(postId: string): Promise<Reply[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReplies.filter(r => r.postId === postId)), 500);
    });
  },

  async createReply(reply: Omit<Reply, 'id' | 'createdAt' | 'likes'>): Promise<Reply> {
    return new Promise((resolve) => {
      const newReply: Reply = {
        ...reply,
        id: `reply-${Date.now()}`,
        createdAt: new Date(),
        likes: 0
      };
      mockReplies.push(newReply);
      setTimeout(() => resolve(newReply), 500);
    });
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockNotifications), 500);
    });
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return new Promise((resolve) => {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
      setTimeout(() => resolve(), 200);
    });
  },

  // Admin Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAdminNotifications), 500);
    });
  },

  // Reports
  async getReports(): Promise<Report[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReports), 500);
    });
  },

  // Connections
  async getConnections(userId: string): Promise<Connection[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockConnections.filter(c => 
        c.fromUserId === userId || c.toUserId === userId
      )), 500);
    });
  },

  async createConnectionRequest(request: Omit<Connection, 'id' | 'requestedAt' | 'status'>): Promise<Connection> {
    return new Promise((resolve) => {
      const newConnection: Connection = {
        ...request,
        id: `conn-${Date.now()}`,
        status: "pending",
        requestedAt: new Date()
      };
      mockConnections.push(newConnection);
      setTimeout(() => resolve(newConnection), 500);
    });
  },

  async respondToConnection(connectionId: string, response: "accepted" | "declined"): Promise<void> {
    return new Promise((resolve) => {
      const connection = mockConnections.find(c => c.id === connectionId);
      if (connection) {
        connection.status = response;
        connection.respondedAt = new Date();
      }
      setTimeout(() => resolve(), 500);
    });
  },

  // Chat Messages
  async getChatMessages(connectionId: string): Promise<ChatMessage[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChatMessages.filter(m => m.connectionId === connectionId)), 500);
    });
  },

  async sendMessage(message: Omit<ChatMessage, 'id' | 'sentAt' | 'isRead'>): Promise<ChatMessage> {
    return new Promise((resolve) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        sentAt: new Date(),
        isRead: false
      };
      mockChatMessages.push(newMessage);
      setTimeout(() => resolve(newMessage), 500);
    });
  }
};
