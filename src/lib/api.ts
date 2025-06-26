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
  PostDetailData,
  PostDetailReply,
} from "./types";

// Mock data storage
// --- USERS ---
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
  {
    id: "user-4",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    createdAt: new Date(2024, 2, 10),
    isActive: true,
  },
  {
    id: "user-5",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    role: "user",
    createdAt: new Date(2024, 1, 5),
    isActive: true,
  },
];

// --- COMMUNITIES ---
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
    id: "photography-enthusiasts",
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
  {
    id: "sustainable-living",
    name: "Sustainable Living",
    description: "Tips and discussions about eco-friendly lifestyle choices",
    memberCount: 1456,
    postCount: 321,
    category: "Lifestyle",
    tags: ["Eco", "Green", "Sustainability"],
    isJoined: false,
    lastActivity: new Date(2024, 5, 23),
    status: "active",
    moderators: ["user-3"],
  },
  {
    id: "indie-game-dev",
    name: "Indie Game Development",
    description:
      "For independent game developers to share experiences and resources",
    memberCount: 987,
    postCount: 210,
    category: "Gaming",
    tags: ["Games", "Indie", "Development"],
    isJoined: false,
    lastActivity: new Date(2024, 5, 24),
    status: "active",
    moderators: ["user-1"],
  },
];

// --- POSTS ---
const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "The Future of Web Development",
    content:
      "What do you think about the latest trends in web development? AI integration seems to be everywhere now.",
    author: "user-1",
    communityId: "web-dev",
    communityName: "Web Development",
    createdAt: new Date(2024, 5, 22),
    likes: 45,
    replies: 5,
    isHot: true,
    isLiked: false,
  },
  {
    id: "post-2",
    title: "Best Photography Spots in the City",
    content:
      "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations.",
    author: "user-2",
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 21),
    likes: 67,
    replies: 3,
    isHot: true,
    isLiked: false,
  },
  {
    id: "post-3",
    title: "Camera Gear Recommendations",
    content:
      "Looking for recommendations on the best camera gear for beginners. Any suggestions?",
    author: "user-2",
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date(2024, 5, 20),
    likes: 23,
    replies: 2,
    isHot: false,
    isLiked: false,
  },
  {
    id: "post-4",
    title: "Sustainable Living Tips for 2024",
    content: "Here are some practical ways to live more sustainably this year!",
    author: "user-3",
    communityId: "sustainable-living",
    communityName: "Sustainable Living",
    createdAt: new Date(2024, 5, 23),
    likes: 88,
    replies: 2,
    isHot: true,
    isLiked: false,
  },
  {
    id: "post-5",
    title: "AI in Indie Game Development",
    content:
      "How are you using AI tools in your indie game projects? Share your experience!",
    author: "user-5",
    communityId: "indie-game-dev",
    communityName: "Indie Game Development",
    createdAt: new Date(2024, 5, 24),
    likes: 120,
    replies: 2,
    isHot: true,
    isLiked: false,
  },
];

// --- REPLIES (flat, with parentReplyId for nesting) ---
const mockReplies: Reply[] = [
  {
    id: "reply-1",
    content:
      "Great insights! I've been working with React for years and the new features are amazing.",
    author: "user-2",
    postId: "post-1",
    parentReplyId: null,
    createdAt: new Date(2024, 5, 22, 10, 30),
    likes: 12,
  },
  {
    id: "reply-1-1",
    content:
      "Absolutely! Hooks and Suspense have changed the way I write components.",
    author: "user-4",
    postId: "post-1",
    parentReplyId: "reply-1",
    createdAt: new Date(2024, 5, 22, 11, 0),
    likes: 5,
  },
  {
    id: "reply-1-1-1",
    content: "And with TypeScript, it's even better!",
    author: "user-5",
    postId: "post-1",
    parentReplyId: "reply-1-1",
    createdAt: new Date(2024, 5, 22, 11, 15),
    likes: 3,
  },
  {
    id: "reply-1-2",
    content: "Don't forget about server components!",
    author: "user-3",
    postId: "post-1",
    parentReplyId: "reply-1",
    createdAt: new Date(2024, 5, 22, 11, 10),
    likes: 2,
  },
  {
    id: "reply-2",
    content:
      "AI is definitely the future. I'm curious how it will impact frontend frameworks.",
    author: "user-4",
    postId: "post-1",
    parentReplyId: null,
    createdAt: new Date(2024, 5, 22, 12, 0),
    likes: 7,
  },
  {
    id: "reply-2-1",
    content:
      "We're already seeing AI-powered code completion and design tools!",
    author: "user-5",
    postId: "post-1",
    parentReplyId: "reply-2",
    createdAt: new Date(2024, 5, 22, 12, 20),
    likes: 4,
  },
  {
    id: "reply-2-1-1",
    content: "Copilot and similar tools are game changers.",
    author: "user-1",
    postId: "post-1",
    parentReplyId: "reply-2-1",
    createdAt: new Date(2024, 5, 22, 12, 30),
    likes: 2,
  },
  {
    id: "reply-3",
    content:
      "I still prefer vanilla JS for most things, but the ecosystem is impressive.",
    author: "user-3",
    postId: "post-1",
    parentReplyId: null,
    createdAt: new Date(2024, 5, 22, 13, 0),
    likes: 6,
  },
  {
    id: "reply-4",
    content: "CSS-in-JS or traditional stylesheets? What's your take?",
    author: "user-5",
    postId: "post-1",
    parentReplyId: null,
    createdAt: new Date(2024, 5, 22, 13, 30),
    likes: 4,
  },
  {
    id: "reply-4-1",
    content: "I use styled-components for everything now.",
    author: "user-2",
    postId: "post-1",
    parentReplyId: "reply-4",
    createdAt: new Date(2024, 5, 22, 13, 45),
    likes: 2,
  },
  {
    id: "reply-4-2",
    content: "Still using SCSS partials!",
    author: "user-3",
    postId: "post-1",
    parentReplyId: "reply-4",
    createdAt: new Date(2024, 5, 22, 13, 50),
    likes: 1,
  },
  {
    id: "reply-5",
    content: "Thanks for starting this discussion! I'm learning a lot.",
    author: "user-4",
    postId: "post-1",
    parentReplyId: null,
    createdAt: new Date(2024, 5, 22, 14, 0),
    likes: 1,
  },
  // ...repeat for other posts, using postId and parentReplyId...
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

// Mock pending moderator role changes
export const mockPendingModeratorRoleChanges = [
  {
    id: "modrole-1",
    user: {
      id: "user-4",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: new Date(2024, 2, 10),
      role: "user",
      status: "active",
      communities: ["Photography Enthusiasts"],
    },
    requestedBy: "user-2",
    requestedAt: new Date(2024, 5, 20),
    newRole: "moderator",
    communityName: "Photography Enthusiasts",
    status: "pending",
  },
  {
    id: "modrole-2",
    user: {
      id: "user-5",
      name: "Carlos Rivera",
      email: "carlos@example.com",
      joinDate: new Date(2024, 1, 5),
      role: "user",
      status: "active",
      communities: ["Tech Innovators"],
    },
    requestedBy: "user-3",
    requestedAt: new Date(2024, 5, 21),
    newRole: "moderator",
    communityName: "Tech Innovators",
    status: "pending",
  },
];

// Remove mockPostDetails and instead use a function to build post detail data from flat posts and replies

function buildPostDetail(postId: string): PostDetailData | null {
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) return null;
  const community = mockCommunities.find((c) => c.id === post.communityId);
  // Build nested replies from flat mockReplies
  function nestReplies(parentId: string | null): PostDetailReply[] {
    return mockReplies
      .filter(
        (r) => (r.parentReplyId || null) === parentId && r.postId === postId
      )
      .map((r) => ({
        id: r.id,
        author: mockUsers.find((u) => u.id === r.author)?.name || r.author,
        content: r.content,
        timestamp: r.createdAt,
        likes: r.likes,
        isLiked: false,
        replies: nestReplies(r.id),
      }));
  }
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: mockUsers.find((u) => u.id === post.author)?.name || post.author,
    timestamp: post.createdAt,
    likes: post.likes,
    comments: post.replies,
    isLiked: post.isLiked,
    isPinned: false,
    isLocked: false,
    commentsLocked: false,
    tags: [],
    replies: nestReplies(null),
    communityId: post.communityId,
    communityName: community?.name || post.communityId,
  };
}

// --- Admin Analytics Mocks ---
const mockAnalyticsCommunities = [
  {
    id: "web-dev",
    name: "Web Development",
    members: 2100,
    posts: 867,
    comments: 3200,
  },
  {
    id: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    members: 1500,
    posts: 543,
    comments: 2100,
  },
  {
    id: "sustainable-living",
    name: "Sustainable Living",
    members: 1456,
    posts: 321,
    comments: 900,
  },
  {
    id: "indie-game-dev",
    name: "Indie Game Development",
    members: 987,
    posts: 210,
    comments: 600,
  },
];

const mockPlatformStats = {
  totalUsers: 5000,
  totalCommunities: 25,
  totalPosts: 3200,
  totalComments: 12000,
  activeUsers: 3200,
  newUsers: 120,
  newCommunities: 2,
  newPosts: 80,
  newComments: 350,
};

const mockActivityData = [
  { date: "2024-06-01", posts: 10, comments: 40 },
  { date: "2024-06-02", posts: 12, comments: 45 },
  { date: "2024-06-03", posts: 8, comments: 38 },
  { date: "2024-06-04", posts: 15, comments: 60 },
  { date: "2024-06-05", posts: 20, comments: 80 },
];

const mockSizeDistribution = [
  { name: "<100", value: 5, color: "#8884d8" },
  { name: "100-500", value: 10, color: "#82ca9d" },
  { name: "500-1000", value: 6, color: "#ffc658" },
  { name: ">1000", value: 4, color: "#ff8042" },
];

// --- Admin Communities Mocks ---
const mockAdminCommunities = [
  {
    id: "web-dev",
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    status: "active",
    createdAt: new Date(2024, 2, 10),
    moderators: ["user-1"],
    tags: ["JavaScript", "React", "Node.js"],
    createdBy: "user-1",
    requestedAt: new Date(2024, 2, 10),
  },
  {
    id: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    category: "Creative",
    status: "active",
    createdAt: new Date(2024, 1, 15),
    moderators: ["user-2"],
    tags: ["Photography", "Camera", "Editing"],
    createdBy: "user-2",
    requestedAt: new Date(2024, 1, 15),
  },
];

const mockPendingCommunities = [
  {
    id: "eco-living",
    name: "Eco Living",
    description:
      "A community for sharing tips and stories about sustainable living.",
    memberCount: 0,
    postCount: 0,
    category: "Lifestyle",
    status: "pending",
    createdAt: new Date(2024, 5, 25),
    moderators: ["user-3"],
    tags: ["Eco", "Green"],
    createdBy: "user-3",
    requestedAt: new Date(2024, 5, 25),
  },
  {
    id: "ai-artists",
    name: "AI Artists",
    description:
      "Exploring the intersection of art and artificial intelligence.",
    memberCount: 0,
    postCount: 0,
    category: "Art",
    status: "pending",
    createdAt: new Date(2024, 5, 24),
    moderators: ["user-4"],
    tags: ["AI", "Art"],
    createdBy: "user-4",
    requestedAt: new Date(2024, 5, 24),
  },
];

// --- Admin Users Mocks ---
const mockAdminUsers = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: new Date(2024, 4, 15),
    isActive: true,
    lastLogin: new Date(2024, 5, 25, 10, 30),
    communities: ["Web Development", "Photography Enthusiasts"],
  },
  {
    id: "user-2",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "moderator",
    status: "active",
    joinDate: new Date(2024, 3, 10),
    isActive: true,
    lastLogin: new Date(2024, 5, 24, 9, 0),
    communities: ["Photography Enthusiasts"],
  },
  {
    id: "user-3",
    name: "Bob Smith",
    email: "bob@example.com",
    role: "admin",
    status: "active",
    joinDate: new Date(2024, 2, 5),
    isActive: true,
    lastLogin: new Date(2024, 5, 23, 14, 15),
    communities: ["Web Development"],
  },
];

const mockPendingAdminRoleChanges = [
  {
    id: "rolechange-1",
    user: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    },
    requestedBy: "user-3",
    requestedAt: new Date(2024, 5, 25),
    newRole: "moderator",
    status: "pending",
    reason: "Active contributor and helpful in discussions.",
  },
  {
    id: "rolechange-2",
    user: {
      id: "user-2",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "moderator",
    },
    requestedBy: "user-3",
    requestedAt: new Date(2024, 5, 24),
    newRole: "admin",
    status: "pending",
    reason: "Consistently moderates and manages community issues.",
  },
];

// --- Admin Reports Mocks ---
const mockAdminReports = [
  {
    id: "1",
    status: "pending",
    contentType: "post",
    contentId: "post-123",
    reason: "Spam",
    createdAt: new Date().toISOString(),
    contentPreview: "This is a preview of the reported post content.",
    originalContent: {
      title: "How to grow tomatoes",
      community: "Gardening",
      author: "Alice",
      fullText:
        "This is the full text of the reported post about growing tomatoes.",
    },
  },
  {
    id: "2",
    status: "pending",
    contentType: "reply",
    contentId: "reply-456",
    reason: "Abusive language",
    createdAt: new Date().toISOString(),
    contentPreview: "This is a preview of the reported reply.",
    originalContent: {
      parentPost: "How to grow tomatoes",
      author: "Bob",
      fullText: "This is the full text of the reported reply.",
    },
  },
  {
    id: "3",
    status: "pending",
    contentType: "user",
    contentId: "user-789",
    reason: "Impersonation",
    createdAt: new Date().toISOString(),
    contentPreview: "This user is pretending to be someone else.",
    originalContent: {
      name: "ImposterUser",
      email: "imposter@example.com",
      joined: "2024-05-01",
      bio: "Trying to be someone else!",
      fullText:
        "User profile: ImposterUser (imposter@example.com) - Trying to be someone else!",
    },
  },
];

// Helper to get original content for a report
function getOriginalContentForReport(report: Report): string | null {
  if (report.type === "post" && report.postId) {
    const post = mockPosts.find((p) => p.id === report.postId);
    return post ? post.content : null;
  }
  if (report.type === "reply" && report.replyId) {
    const reply = mockReplies.find((r) => r.id === report.replyId);
    return reply ? reply.content : null;
  }
  if (report.type === "user" && report.userId) {
    const user = mockUsers.find((u) => u.id === report.userId);
    return user ? user.name : null;
  }
  return null;
}

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
      setTimeout(
        () => resolve(mockPosts.filter((p) => p.isHot).slice(0, 10)),
        0
      );
    });
  },

  async getPost(id: string): Promise<Post | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPosts.find((p) => p.id === id) || null), 0);
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
        isLiked: false,
      };
      mockPosts.push(newPost);
      setTimeout(() => resolve(newPost), 500);
    });
  },

  async getPostDetail(postId: string): Promise<PostDetailData | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(buildPostDetail(postId)), 500);
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
      setTimeout(() => resolve(newMessage));
    });
  },

  // --- Admin Analytics API ---
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

  // --- Admin Communities API ---
  async getAdminCommunities() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminCommunities), 300)
    );
  },
  async getPendingCommunities() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPendingCommunities), 300)
    );
  },
  async getAdminUsers() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminUsers), 300)
    );
  },
  async getPendingAdminRoleChanges() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockPendingAdminRoleChanges), 300)
    );
  },
  async getAdminReports() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminReports), 300)
    );
  },

  // --- Admin Roles API ---
  async getAdminRoles() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockAdminRoles), 300)
    );
  },

  // --- Community Detail API ---
  async getCommunityDetail(communityId: string) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityDetails[communityId] || null), 300)
    );
  },
  async getCommunityPosts(communityId: string) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityPosts[communityId] || []), 300)
    );
  },

  async submitReport(reportData) {
    // Simulate saving the report and returning the created report object
    const newReport = {
      id: `report-${Date.now()}`,
      ...reportData,
      status: "pending",
      createdAt: new Date(),
    };
    // Optionally push to mockReports if you want to see it in admin
    // mockReports.push(newReport);
    return new Promise((resolve) => setTimeout(() => resolve(newReport), 300));
  },
};

// New function to get flagged reports for a community
export function getMockFlaggedReports(communityId: string) {
  return mockReports.filter(
    (r) => r.communityId === communityId && r.status === "pending"
  );
}

// --- Community Detail Mocks ---
const mockCommunityDetails = {
  "web-dev": {
    id: "web-dev",
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    tags: ["JavaScript", "React", "Node.js"],
    isMember: true,
    isModerator: false,
    moderators: [
      {
        id: "user-1",
        name: "John Doe",
        role: "moderator",
        joinedAsModAt: new Date(2024, 2, 10),
      },
    ],
    rules: ["Be respectful", "Stay on topic", "No spam"],
    category: "Technology",
    isJoined: true,
    lastActivity: new Date(2024, 5, 21),
    createdBy: "user-1",
    requestedAt: new Date(2024, 2, 10),
    status: "active",
  },
  photography: {
    id: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    tags: ["Photography", "Camera", "Editing"],
    isMember: false,
    isModerator: true,
    moderators: [
      {
        id: "user-2",
        name: "Alice Johnson",
        role: "moderator",
        joinedAsModAt: new Date(2024, 3, 10),
      },
    ],
    rules: [
      "Share original work",
      "Give constructive feedback",
      "No self-promotion",
    ],
    category: "Creative",
    isJoined: true,
    lastActivity: new Date(2024, 5, 22),
    createdBy: "user-2",
    requestedAt: new Date(2024, 1, 15),
    status: "active",
  },
  "1": {
    id: "1",
    name: "Photography Enthusiasts",
    description:
      "A place for photographers to share their work and discuss techniques",
    memberCount: 1250,
    postCount: 2,
    tags: ["Photography", "Art", "Camera"],
    isMember: true,
    isModerator: true,
    moderators: [
      {
        id: "user-2",
        name: "Alice Johnson",
        role: "moderator",
        joinedAsModAt: new Date(2024, 3, 10),
      },
    ],
    rules: [
      "Share original work",
      "Give constructive feedback",
      "No self-promotion",
    ],
    category: "Creative",
    isJoined: true,
    lastActivity: new Date(2024, 5, 22),
    createdBy: "user-2",
    requestedAt: new Date(2024, 1, 15),
    status: "active",
  },
};

const mockCommunityPosts = {
  "web-dev": [
    {
      id: "post-1",
      title: "The Future of Web Development",
      content:
        "What do you think about the latest trends in web development? AI integration seems to be everywhere now.",
      author: "TechEnthusiast",
      timestamp: new Date(2024, 5, 22),
      likes: 45,
      comments: 23,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: ["web", "ai", "trends"],
      communityId: "web-dev",
      communityName: "Web Development",
      lockReason: undefined,
      commentsLockReason: undefined,
      replies: [],
    },
  ],
  photography: [
    {
      id: "post-2",
      title: "Best Photography Spots in the City",
      content:
        "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations.",
      author: "PhotographyPro",
      timestamp: new Date(2024, 5, 21),
      likes: 67,
      comments: 34,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: ["photography", "city", "locations"],
      communityId: "photography-enthusiasts",
      communityName: "Photography Enthusiasts",
      lockReason: undefined,
      commentsLockReason: undefined,
      replies: [],
    },
  ],
  "1": [
    {
      id: "post-2",
      title: "Best Photography Spots in the City",
      content:
        "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations.",
      author: "PhotographyPro",
      timestamp: new Date(2024, 5, 21),
      likes: 67,
      comments: 34,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: ["photography", "city", "locations"],
      communityId: "photography-enthusiasts",
      communityName: "Photography Enthusiasts",
      lockReason: undefined,
      commentsLockReason: undefined,
      replies: [],
    },
    {
      id: "post-3",
      title: "Camera Gear Recommendations",
      content:
        "Looking for recommendations on the best camera gear for beginners. Any suggestions?",
      author: "NewPhotographer",
      timestamp: new Date(2024, 5, 20),
      likes: 23,
      comments: 12,
      isLiked: false,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: ["camera", "gear", "beginner"],
      communityId: "photography-enthusiasts",
      communityName: "Photography Enthusiasts",
      lockReason: undefined,
      commentsLockReason: undefined,
      replies: [],
    },
  ],
};

// --- Admin Roles Mocks ---
const mockAdminRoles = [
  {
    id: "role-1",
    name: "Admin",
    permissions: [
      "manage_users",
      "manage_communities",
      "manage_roles",
      "view_reports",
      "edit_settings",
    ],
    description:
      "Full access to all admin features. Can manage users, communities, roles, and settings.",
    icon: "admin",
    color: "bg-yellow-500",
    userCount: 1,
    users: [
      {
        id: "user-3",
        name: "Bob Smith",
        email: "bob@example.com",
        joinDate: new Date(2024, 2, 5),
        communities: ["Web Development"],
      },
    ],
  },
  {
    id: "role-2",
    name: "Moderator",
    permissions: ["manage_communities", "view_reports"],
    description:
      "Can moderate communities and view reports, but cannot manage users or roles.",
    icon: "moderator",
    color: "bg-blue-500",
    userCount: 1,
    users: [
      {
        id: "user-2",
        name: "Alice Johnson",
        email: "alice@example.com",
        joinDate: new Date(2024, 3, 10),
        communities: ["Photography Enthusiasts"],
      },
    ],
  },
  {
    id: "role-3",
    name: "Users",
    permissions: ["post_content"],
    description: "Can post content.",
    icon: "user",
    color: "bg-green-500",
    userCount: 1,
    users: [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        joinDate: new Date(2024, 4, 15),
        communities: ["Web Development", "Photography Enthusiasts"],
      },
    ],
  },
];
