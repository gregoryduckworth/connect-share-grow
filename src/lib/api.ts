import {
  Post,
  Community,
  User,
  Reply,
  Notification,
  AdminNotification,
  Report,
  Connection,
  ChatMessage,
} from "./types";

// Mock data storage
const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "The Future of Web Development",
    content:
      "What do you think about the latest trends in web development? AI integration seems to be everywhere now.",
    author: "TechEnthusiast",
    communityId: "web-dev",
    communityName: "Web Development",
    createdAt: new Date(2024, 5, 22),
    likes: 45,
    replies: 23,
    isHot: true,
  },
  {
    id: "post-2",
    title: "Best Photography Spots in the City",
    content:
      "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations.",
    author: "PhotographyPro",
    communityId: "photography",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 21),
    likes: 67,
    replies: 34,
    isHot: true,
  },
  {
    id: "post-3",
    title: "Camera Gear Recommendations",
    content:
      "Looking for recommendations on the best camera gear for beginners. Any suggestions?",
    author: "NewPhotographer",
    communityId: "photography",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 20),
    likes: 23,
    replies: 12,
    isHot: false,
  },
];

const mockCommunities: Community[] = [
  {
    id: "web-dev",
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    tags: ["JavaScript", "React", "Node.js"],
    isJoined: false,
    lastActivity: new Date(2024, 5, 21),
    status: "active",
    moderators: ["user-1"],
  },
  {
    id: "photography",
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    category: "Creative",
    tags: ["Photography", "Camera", "Editing"],
    isJoined: true,
    lastActivity: new Date(2024, 5, 22),
    status: "active",
    moderators: ["user-2"],
  },
];

const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: new Date(2024, 4, 15),
    isActive: true,
    bio: "Photography enthusiast and community moderator",
  },
  {
    id: "user-2",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "moderator",
    createdAt: new Date(2024, 3, 10),
    isActive: true,
  },
  {
    id: "user-3",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "admin",
    createdAt: new Date(2024, 2, 5),
    isActive: true,
  },
];

const mockReplies: Reply[] = [
  {
    id: "reply-1",
    content:
      "Great insights! I've been working with React for years and the new features are amazing.",
    author: "ReactDev",
    postId: "post-1",
    createdAt: new Date(2024, 5, 22, 10, 30),
    likes: 12,
  },
  {
    id: "reply-2",
    content:
      "Thanks for sharing these spots! I'll definitely check them out this weekend.",
    author: "PhotoFan",
    postId: "post-2",
    createdAt: new Date(2024, 5, 21, 15, 45),
    likes: 8,
  },
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
    userId: "user-2",
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
    userId: "user-3",
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
    userId: "user-1",
  },
];

const mockAdminNotifications: AdminNotification[] = [
  {
    id: "admin-notif-1",
    type: "community_approval",
    title: "New Community Pending Approval",
    message: "Tech Discussions community is awaiting approval",
    timestamp: new Date(2024, 5, 20, 16, 30),
    isRead: false,
    priority: "medium",
  },
  {
    id: "admin-notif-2",
    type: "user_report",
    title: "New User Report",
    message: "User reported for inappropriate content in Photography community",
    timestamp: new Date(2024, 5, 20, 15, 45),
    isRead: false,
    priority: "high",
  },
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
    originalContent:
      "Check out this amazing new framework that will revolutionize web development!",
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
    originalContent:
      "Your photos are terrible and you should stop posting here.",
  },
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
    respondedAt: new Date(2024, 5, 16),
  },
  {
    id: "conn-2",
    fromUserId: "user-3",
    toUserId: "user-1",
    fromUserName: "Bob Smith",
    toUserName: "John Doe",
    message:
      "Would like to connect for potential collaboration on web projects.",
    status: "pending",
    requestedAt: new Date(2024, 5, 20),
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    connectionId: "conn-1",
    senderId: "user-1",
    content: "Hey Alice! Thanks for accepting my connection request.",
    sentAt: new Date(2024, 5, 16, 10, 0),
    isRead: true,
  },
  {
    id: "msg-2",
    connectionId: "conn-1",
    senderId: "user-2",
    content: "No problem! Looking forward to sharing photography tips.",
    sentAt: new Date(2024, 5, 16, 10, 15),
    isRead: true,
  },
];

// --- Analytics/Statistics Mock Data ---
export const mockAnalyticsCommunities = [
  {
    id: "comm-1",
    name: "Photography Enthusiasts",
    members: 128,
    posts: 342,
    comments: 1456,
  },
  { id: "comm-2", name: "Tech Talk", members: 256, posts: 789, comments: 2890 },
  {
    id: "comm-3",
    name: "Book Readers",
    members: 96,
    posts: 156,
    comments: 678,
  },
  {
    id: "comm-4",
    name: "Travel Adventures",
    members: 78,
    posts: 234,
    comments: 890,
  },
  {
    id: "comm-5",
    name: "Fitness & Health",
    members: 189,
    posts: 445,
    comments: 1234,
  },
];

export const mockPlatformStats = {
  totalUsers: 2847,
  totalCommunities: 12,
  totalPosts: 5673,
  totalComments: 18429,
  activeUsers: 1892,
  newUsersThisMonth: 342,
  reportsCount: 23,
  moderatorsCount: 15,
};

export const mockActivityData = [
  { date: "2024-06-01", users: 120, posts: 45, comments: 180 },
  { date: "2024-06-07", users: 135, posts: 52, comments: 210 },
  { date: "2024-06-14", users: 142, posts: 48, comments: 195 },
  { date: "2024-06-21", users: 158, posts: 61, comments: 240 },
];

export const mockSizeDistribution = [
  { name: "Small (0-50)", value: 3, color: "#8884d8" },
  { name: "Medium (51-150)", value: 6, color: "#82ca9d" },
  { name: "Large (151+)", value: 3, color: "#ffc658" },
];

// Pending communities mock for admin page
export const mockPendingCommunities = [
  {
    id: "pending-1",
    name: "Cryptocurrency Trading",
    description: "Discussion about crypto trading strategies",
    memberCount: 0,
    postCount: 0,
    category: "Finance",
    createdAt: new Date(2024, 5, 15),
    status: "pending",
    moderators: [],
    tags: ["Crypto", "Trading", "Investment"],
    createdBy: "John Trader",
    requestedAt: new Date(2024, 5, 15),
  },
];

// Admin communities mock (with createdAt, requestedAt, etc.)
export const mockAdminCommunities = [
  {
    id: "comm-1",
    name: "Photography Enthusiasts",
    description: "A place for photographers to share their work",
    memberCount: 1250,
    postCount: 423,
    category: "Art & Design",
    createdAt: new Date(2023, 0, 15),
    status: "active",
    moderators: ["Sarah Johnson", "Mike Chen"],
    tags: ["Photography", "Art", "Camera"],
    createdBy: "admin",
    requestedAt: new Date(2023, 0, 15),
  },
  {
    id: "comm-2",
    name: "Web Development",
    description: "Modern web development practices",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    createdAt: new Date(2023, 1, 20),
    status: "active",
    moderators: ["Alex Rivera"],
    tags: ["JavaScript", "React", "Node.js"],
    createdBy: "admin",
    requestedAt: new Date(2023, 1, 20),
  },
  {
    id: "comm-3",
    name: "Cooking Club",
    description: "Share recipes and cooking tips",
    memberCount: 890,
    postCount: 234,
    category: "Food & Drink",
    createdAt: new Date(2023, 2, 10),
    status: "suspended",
    moderators: ["Emma Davis"],
    tags: ["Cooking", "Recipes", "Food"],
    createdBy: "admin",
    requestedAt: new Date(2023, 2, 10),
  },
];

// Admin users mock data
export const mockAdminUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: new Date(2023, 0, 15),
    role: "admin",
    status: "active",
    communities: ["Photography", "Tech Talk"],
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    joinDate: new Date(2023, 1, 3),
    role: "moderator",
    status: "active",
    communities: ["Cooking Club", "Travel Adventures"],
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    joinDate: new Date(2023, 2, 20),
    role: "user",
    status: "active",
    communities: ["Book Readers"],
  },
  {
    id: "user-4",
    name: "Lisa Brown",
    email: "lisa.b@example.com",
    joinDate: new Date(2023, 3, 5),
    role: "user",
    status: "suspended",
    communities: [],
    suspensionReason:
      "Repeated violation of community guidelines and inappropriate behavior",
    suspendedAt: new Date(2024, 5, 10),
    suspendedBy: "admin@example.com",
  },
  {
    id: "user-5",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    joinDate: new Date(2023, 4, 12),
    role: "user",
    status: "active",
    communities: ["Gaming", "Tech Talk"],
  },
];

// Pending admin role changes mock
export const mockPendingAdminRoleChanges = [
  {
    id: "mock-1",
    user: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: new Date(2023, 1, 3),
      role: "moderator",
      status: "active",
      communities: ["Cooking Club", "Travel Adventures"],
    },
    requestedBy: "admin@example.com",
    requestedAt: new Date(),
    newRole: "admin",
  },
];

// Admin roles mock data
export const mockAdminRoles = [
  {
    name: "Admin",
    description: "Full system access with all administrative privileges",
    permissions: [
      "Manage all users and communities",
      "Access admin dashboard and analytics",
      "Modify system settings",
      "Handle reports and moderation",
      "Assign and revoke roles",
    ],
    userCount: 2,
    users: [
      {
        id: "admin-1",
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: new Date(2023, 0, 15),
        communities: ["Photography", "Tech Talk"],
      },
      {
        id: "admin-2",
        name: "Sarah Admin",
        email: "sarah.admin@example.com",
        joinDate: new Date(2023, 1, 1),
        communities: ["Photography", "Web Development"],
      },
    ],
    icon: "admin",
    color: "bg-red-500",
  },
  {
    name: "Moderator",
    description: "Community moderation and user management capabilities",
    permissions: [
      "Moderate community content",
      "Lock/unlock posts and comments",
      "Manage community rules",
      "Handle community reports",
      "Pin important posts",
    ],
    userCount: 5,
    users: [
      {
        id: "mod-1",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        joinDate: new Date(2023, 1, 3),
        communities: ["Cooking Club", "Travel Adventures"],
      },
      {
        id: "mod-2",
        name: "Mike Chen",
        email: "mike.chen@example.com",
        joinDate: new Date(2023, 2, 10),
        communities: ["Photography"],
      },
      {
        id: "mod-3",
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        joinDate: new Date(2023, 3, 15),
        communities: ["Web Development", "Tech Talk"],
      },
      {
        id: "mod-4",
        name: "Emma Davis",
        email: "emma.davis@example.com",
        joinDate: new Date(2023, 4, 20),
        communities: ["Book Club"],
      },
      {
        id: "mod-5",
        name: "Tom Wilson",
        email: "tom.wilson@example.com",
        joinDate: new Date(2023, 5, 5),
        communities: ["Fitness & Health"],
      },
    ],
    icon: "moderator",
    color: "bg-orange-500",
  },
  {
    name: "User",
    description: "Standard user with basic community participation rights",
    permissions: [
      "Create and edit own posts",
      "Comment on posts",
      "Join communities",
      "Like and share content",
      "Report inappropriate content",
    ],
    userCount: 1247,
    users: [
      {
        id: "user-1",
        name: "Robert Johnson",
        email: "robert.j@example.com",
        joinDate: new Date(2023, 2, 20),
        communities: ["Book Readers"],
      },
      {
        id: "user-2",
        name: "Lisa Brown",
        email: "lisa.b@example.com",
        joinDate: new Date(2023, 3, 5),
        communities: [],
      },
      {
        id: "user-3",
        name: "Michael Wilson",
        email: "michael.w@example.com",
        joinDate: new Date(2023, 4, 12),
        communities: ["Gaming", "Tech Talk"],
      },
    ],
    icon: "user",
    color: "bg-blue-500",
  },
];

// --- Admin Reports Mock Data ---
export const mockAdminReports = [
  {
    id: "report-1",
    contentType: "post",
    contentId: "post-123",
    contentPreview:
      "This post contains potentially inappropriate content about politics and inflammatory language that goes against community guidelines. It uses divisive rhetoric and could incite arguments.",
    reportedBy: "user-456",
    reason: "Contains inappropriate content",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    status: "pending",
    originalContent: {
      title: "Why Current Political System is Completely Broken",
      author: "AngryUser2024",
      community: "Political Discussion",
      fullText:
        "I'm so tired of all these politicians lying to us constantly. They're all corrupt and only care about their own power. The whole system needs to be torn down and rebuilt from scratch. Anyone who supports the current administration is either blind or complicit in this corruption. We need to take action now before it's too late and our democracy is completely destroyed. This is not a drill - we're heading towards a complete collapse of our society if we don't act immediately.",
    },
  },
  {
    id: "report-2",
    contentType: "reply",
    contentId: "reply-789",
    contentPreview:
      "This reply contains offensive language and personal attacks directed at other community members. The language used is clearly harassment and violates our community standards.",
    reportedBy: "user-101",
    reason: "Harassment",
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    status: "pending",
    originalContent: {
      author: "ToxicUser123",
      parentPost: "Best Programming Languages for Beginners",
      fullText:
        "You're absolutely clueless and shouldn't be giving advice to anyone. Your suggestions are terrible and show you have no idea what you're talking about. Maybe stick to something you actually understand instead of spreading misinformation. People like you are what's wrong with this community - always acting like experts when you clearly aren't. Just delete your account and save everyone the trouble of reading your garbage posts.",
    },
  },
  {
    id: "report-3",
    contentType: "user",
    contentId: "user-202",
    contentPreview:
      "This user has been repeatedly posting spam across multiple communities including promotional links, duplicate content, and off-topic advertisements that disrupt community discussions.",
    reportedBy: "user-303",
    reason: "Spamming",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: "pending",
  },
];

// --- Post Detail Mock Data ---
export const mockPostDetail: import("./types").PostDetailData = {
  id: "1",
  title: "Golden Hour Landscape Tips",
  content:
    "Here are some techniques I've learned for capturing stunning golden hour landscapes. The key is to arrive early and scout your location during the day. Understanding how the light will hit your subject is crucial for getting that perfect shot.",
  author: "Sarah Johnson",
  timestamp: new Date(2024, 5, 15, 14, 30),
  likes: 24,
  comments: 8,
  isLiked: false,
  isPinned: true,
  isLocked: false,
  commentsLocked: false,
  tags: ["Landscape", "Golden Hour", "Tips"],
  communityId: "1",
  communityName: "Photography Enthusiasts",
  replies: [
    {
      id: "reply-1",
      author: "Alice Cooper",
      content:
        "Great tips! I especially love the advice about using graduated filters. Do you have any specific brand recommendations?",
      timestamp: new Date(2024, 5, 15, 15, 45),
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: "reply-1-1",
          author: "Sarah Johnson",
          content:
            "I personally use Lee Filters - they're a bit pricey but the quality is excellent. Cokin is also a good budget option!",
          timestamp: new Date(2024, 5, 15, 16, 15),
          likes: 3,
          isLiked: false,
          parentId: "reply-1",
          replies: [
            {
              id: "reply-1-1-1",
              author: "Third Level User",
              content: "This is a 3rd level reply for visual testing.",
              timestamp: new Date(2024, 5, 15, 16, 45),
              likes: 1,
              isLiked: false,
              parentId: "reply-1-1",
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: "reply-2",
      author: "Bob Wilson",
      content:
        "Thanks for sharing! Do you have any recommendations for specific lens filters? I'm just starting out with landscape photography.",
      timestamp: new Date(2024, 5, 15, 16, 20),
      likes: 3,
      isLiked: true,
      replies: [],
    },
    {
      id: "reply-3",
      author: "Emma Davis",
      content:
        "This is so helpful! I've been struggling with exposure during golden hour. Your tip about bracketing shots is game-changing.",
      timestamp: new Date(2024, 5, 15, 17, 10),
      likes: 2,
      isLiked: false,
      replies: [],
    },
  ],
};

// Community detail mock for Photography Enthusiasts
export const mockCommunityDetail = {
  id: "1",
  name: "Photography Enthusiasts",
  description:
    "A place for photographers to share their work and discuss techniques",
  memberCount: 1250,
  postCount: 423,
  tags: ["Photography", "Art", "Camera", "Editing"],
  isMember: true,
  isModerator: true,
  moderators: [
    {
      id: "mod-1",
      name: "Sarah Johnson",
      role: "Lead Moderator",
      joinedAsModAt: new Date(2023, 0, 15),
    },
    {
      id: "mod-2",
      name: "Mike Chen",
      role: "Moderator",
      joinedAsModAt: new Date(2023, 2, 20),
    },
    {
      id: "mod-3",
      name: "Alex Rivera",
      role: "Moderator",
      joinedAsModAt: new Date(2023, 4, 10),
    },
  ],
  rules: [
    "Be respectful to all members",
    "No spam or self-promotion without approval",
    "Share constructive feedback on others' work",
    "Use appropriate tags for your posts",
    "No inappropriate or offensive content",
  ],
};

export const mockCommunityPosts = [
  {
    id: "1",
    title: "Golden Hour Landscape Tips",
    content:
      "Here are some techniques I've learned for capturing stunning golden hour landscapes...",
    author: "Sarah Johnson",
    timestamp: new Date(2024, 5, 15, 14, 30),
    likes: 24,
    comments: 8,
    isLiked: false,
    isPinned: true,
    isLocked: false,
    commentsLocked: false,
    tags: ["Landscape", "Golden Hour", "Tips"],
  },
  {
    id: "2",
    title: "Street Photography Ethics",
    content:
      "Let's discuss the ethical considerations when photographing strangers in public spaces...",
    author: "Mike Chen",
    timestamp: new Date(2024, 5, 14, 10, 15),
    likes: 15,
    comments: 12,
    isLiked: true,
    isPinned: false,
    isLocked: false,
    commentsLocked: false,
    tags: ["Street Photography", "Ethics", "Discussion"],
  },
];

export const api = {
  // Posts
  async getPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPosts), 500);
    });
  },

  async getHotPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockPosts.filter((p) => p.isHot).slice(0, 10)),
        500
      );
    });
  },

  async getPost(id: string): Promise<Post | null> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockPosts.find((p) => p.id === id) || null),
        500
      );
    });
  },

  async createPost(
    post: Omit<Post, "id" | "createdAt" | "likes" | "replies">
  ): Promise<Post> {
    return new Promise((resolve) => {
      const newPost: Post = {
        ...post,
        id: `post-${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
        replies: 0,
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
      setTimeout(
        () => resolve(mockCommunities.find((c) => c.id === id) || null),
        500
      );
    });
  },

  async getCommunityDetail(communityId: string) {
    // In a real app, filter by communityId
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityDetail), 300)
    );
  },

  async getCommunityPosts(communityId: string) {
    // In a real app, filter by communityId
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityPosts), 300)
    );
  },

  // Users
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  async getUser(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockUsers.find((u) => u.id === id) || null),
        500
      );
    });
  },

  // Replies
  async getReplies(postId: string): Promise<Reply[]> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockReplies.filter((r) => r.postId === postId)),
        500
      );
    });
  },

  async createReply(
    reply: Omit<Reply, "id" | "createdAt" | "likes">
  ): Promise<Reply> {
    return new Promise((resolve) => {
      const newReply: Reply = {
        ...reply,
        id: `reply-${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
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
      const notification = mockNotifications.find(
        (n) => n.id === notificationId
      );
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
      setTimeout(
        () =>
          resolve(
            mockConnections.filter(
              (c) => c.fromUserId === userId || c.toUserId === userId
            )
          ),
        500
      );
    });
  },

  async createConnectionRequest(
    request: Omit<Connection, "id" | "requestedAt" | "status">
  ): Promise<Connection> {
    return new Promise((resolve) => {
      const newConnection: Connection = {
        ...request,
        id: `conn-${Date.now()}`,
        status: "pending",
        requestedAt: new Date(),
      };
      mockConnections.push(newConnection);
      setTimeout(() => resolve(newConnection), 500);
    });
  },

  async respondToConnection(
    connectionId: string,
    response: "accepted" | "declined"
  ): Promise<void> {
    return new Promise((resolve) => {
      const connection = mockConnections.find((c) => c.id === connectionId);
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
      setTimeout(
        () =>
          resolve(
            mockChatMessages.filter((m) => m.connectionId === connectionId)
          ),
        500
      );
    });
  },

  async sendMessage(
    message: Omit<ChatMessage, "id" | "sentAt" | "isRead">
  ): Promise<ChatMessage> {
    return new Promise((resolve) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        sentAt: new Date(),
        isRead: false,
      };
      mockChatMessages.push(newMessage);
      setTimeout(() => resolve(newMessage), 500);
    });
  },

  // Analytics
  async getAnalyticsCommunities() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAnalyticsCommunities), 300)
    );
  },
  async getPlatformStats() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPlatformStats), 300)
    );
  },
  async getActivityData() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockActivityData), 300)
    );
  },
  async getSizeDistribution() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockSizeDistribution), 300)
    );
  },

  // Pending communities
  async getPendingCommunities() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPendingCommunities), 300)
    );
  },

  // Admin communities
  async getAdminCommunities() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminCommunities), 300)
    );
  },

  // Admin users
  async getAdminUsers() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminUsers), 300)
    );
  },

  // Pending admin role changes
  async getPendingAdminRoleChanges() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPendingAdminRoleChanges), 300)
    );
  },

  // Admin roles
  async getAdminRoles() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminRoles), 300)
    );
  },

  // Admin Reports
  async getAdminReports() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminReports), 300)
    );
  },

  async getPostDetail(
    postId: string
  ): Promise<import("./types").PostDetailData> {
    // In a real app, you'd filter by postId
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPostDetail), 300)
    );
  },

  // Submit a new report
  async submitReport(
    report: Omit<Report, "id" | "reportedAt" | "status">
  ): Promise<Report> {
    return new Promise((resolve) => {
      const newReport: Report = {
        ...report,
        id: `report-${Date.now()}`,
        reportedAt: new Date(),
        status: "pending",
      };
      mockReports.push(newReport);
      setTimeout(() => resolve(newReport), 500);
    });
  },
};
