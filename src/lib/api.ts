import type {
  Post,
  Community,
  User,
  Reply,
  Notification,
  ReportBase as Report,
  PostDetailData,
  PostDetailReply,
  CommunityDetail,
  CommunityPost,
  AdminRole,
  AdminRoleUser,
  AnalyticsCommunity,
  ActivityDataPoint,
  AnalyticsDataPoint,
  PlatformStats,
} from "./types";

// Mock Database Tables - separated by type for easier management
const USERS_TABLE: User[] = [
  // Demo Admin User
  {
    id: "demo-admin-0001",
    name: "Demo Admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Demo admin account for testing.",
    location: "Demo City",
  },
  // Demo Regular User
  {
    id: "demo-user-0001",
    name: "Demo User",
    email: "user@example.com",
    role: "user",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Demo user account for testing.",
    location: "Demo Town",
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "user",
    createdAt: new Date("2024-01-15T10:30:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Photography enthusiast and nature lover",
    location: "San Francisco, CA",
  },
  {
    id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "moderator",
    createdAt: new Date("2024-01-10T14:20:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Tech enthusiast and community moderator",
    location: "New York, NY",
  },
  {
    id: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    name: "Mike Rodriguez",
    email: "mike.rodriguez@example.com",
    role: "user",
    createdAt: new Date("2024-01-20T09:15:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Fitness trainer and wellness coach",
    location: "Austin, TX",
  },
  {
    id: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "admin",
    createdAt: new Date("2024-01-05T16:45:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Community administrator and developer",
    location: "Seattle, WA",
  },
  {
    id: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "user",
    createdAt: new Date("2024-01-12T11:30:00Z"),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    avatar: "",
    bio: "Travel blogger and photographer",
    location: "Los Angeles, CA",
  },
];

const COMMUNITIES_TABLE: Community[] = [
  {
    slug: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "A community for photographers of all skill levels to share tips, techniques, and showcase their work.",
    memberCount: 1247,
    postCount: 89,
    category: "Creative Arts",
    tags: ["photography", "art", "creative", "digital"],
    isJoined: true,
    lastActivity: new Date("2024-01-25T14:30:00Z"),
    createdBy: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    status: "active",
    moderators: ["b2c3d4e5-f6g7-8901-2345-678901bcdefg"],
  },
  {
    slug: "tech-discussions",
    name: "Tech Discussions",
    description:
      "Discuss the latest trends in technology, programming languages, and software development.",
    memberCount: 2156,
    postCount: 234,
    category: "Technology",
    tags: ["tech", "programming", "software", "development"],
    isJoined: true,
    lastActivity: new Date("2024-01-24T16:20:00Z"),
    createdBy: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    status: "active",
    moderators: [
      "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
      "d4e5f6g7-h8i9-0123-4567-890123defghi",
    ],
  },
  {
    slug: "fitness-wellness",
    name: "Fitness & Wellness",
    description:
      "Share workout routines, nutrition tips, and wellness advice for a healthier lifestyle.",
    memberCount: 892,
    postCount: 156,
    category: "Health & Fitness",
    tags: ["fitness", "health", "wellness", "nutrition"],
    isJoined: false,
    lastActivity: new Date("2024-01-23T12:45:00Z"),
    createdBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    status: "active",
    moderators: ["c3d4e5f6-g7h8-9012-3456-789012cdefgh"],
  },
  {
    slug: "entrepreneurs-united",
    name: "Entrepreneurs United",
    description:
      "Connect with fellow entrepreneurs, share business insights, and grow your network.",
    memberCount: 1834,
    postCount: 167,
    category: "Business",
    tags: ["entrepreneurship", "business", "startups", "networking"],
    isJoined: false,
    lastActivity: new Date("2024-01-21T09:30:00Z"),
    createdBy: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    status: "active",
    moderators: ["e5f6g7h8-i9j0-1234-5678-901234efghij"],
  },
];

const POSTS_TABLE: Post[] = [
  {
    id: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    title: "Best Camera Settings for Golden Hour Photography",
    content:
      "Golden hour provides the most beautiful natural lighting for photography. Here are my recommended camera settings: Use a wide aperture (f/1.4-f/2.8) for shallow depth of field, keep ISO low (100-400) to minimize noise, and adjust shutter speed based on your subject movement. Don't forget to shoot in RAW format for maximum editing flexibility!",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Alex Johnson
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-01-25T14:30:00Z"),
    likes: 45,
    replies: 12,
    isLiked: true,
    isHot: true,
  },
  {
    id: "p6a7b8c9-d0e1-f234-5678-901234bcdefg",
    title: "How to Edit Photos Like a Pro",
    content:
      "Editing is just as important as taking the photo! What software do you use and what are your favorite editing tips for beginners?",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Alex Johnson
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-01-20T10:00:00Z"),
    likes: 22,
    replies: 5,
    isLiked: false,
    isHot: false,
  },
  {
    id: "p7b8c9d0-e1f2-g345-6789-012345cdefgh",
    title: "Show Us Your Best Wildlife Shots!",
    content:
      "Let's have a thread for wildlife photography. Share your favorite animal photos and the story behind them!",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij", // David Kim
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-01-18T09:00:00Z"),
    likes: 31,
    replies: 7,
    isLiked: false,
    isHot: false,
  },
  {
    id: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    title: "The Future of React Server Components",
    content:
      "React Server Components are revolutionizing how we think about server-side rendering and client-side interactivity. This new paradigm allows us to run components on the server, reducing bundle size and improving performance. Let's discuss the implications and best practices for implementing RSCs in production applications.",
    author: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    communityId: "tech-discussions",
    communityName: "Tech Discussions",
    createdAt: new Date("2024-01-24T16:20:00Z"),
    likes: 67,
    replies: 18,
    isLiked: false,
    isHot: true,
  },
  {
    id: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
    title: "My 30-Day Fitness Transformation Journey",
    content:
      "I wanted to share my incredible 30-day fitness transformation journey with everyone. Through consistent daily workouts, proper nutrition planning, and staying motivated, I've seen amazing results. Here's my detailed workout routine, meal plans, and the mindset shifts that made all the difference.",
    author: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    communityId: "fitness-wellness",
    communityName: "Fitness & Wellness",
    createdAt: new Date("2024-01-23T12:45:00Z"),
    likes: 23,
    replies: 8,
    isLiked: false,
  },
  {
    id: "p4d5e6f7-g8h9-i012-3456-789012defghi",
    title: "Building a Sustainable Startup Culture",
    content:
      "Creating a lasting company culture is one of the biggest challenges for entrepreneurs. After building three startups, I've learned that culture isn't something you can force - it grows organically from your values and actions. Here are the key principles that have helped me build strong, sustainable teams.",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    communityId: "entrepreneurs-united",
    communityName: "Entrepreneurs United",
    createdAt: new Date("2024-01-22T18:15:00Z"),
    likes: 34,
    replies: 15,
    isLiked: true,
  },
];

const REPLIES_TABLE: Reply[] = [
  {
    id: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    content:
      "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    createdAt: new Date("2024-01-25T15:45:00Z"),
    likes: 8,
    parentReplyId: null,
  },
  {
    id: "r2b3c4d5-e6f7-g890-1234-567890bcdefg",
    content:
      "RSCs are game-changing! We've implemented them in our production app and saw a 40% reduction in bundle size.",
    author: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    createdAt: new Date("2024-01-24T17:30:00Z"),
    likes: 12,
    parentReplyId: null,
  },
  {
    id: "r3c4d5e6-f7g8-h901-2345-678901cdefgh",
    content:
      "Amazing transformation! What was your biggest challenge during the 30 days?",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    postId: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
    createdAt: new Date("2024-01-23T14:20:00Z"),
    likes: 3,
    parentReplyId: null,
  },
];

const NOTIFICATIONS_TABLE: Notification[] = [
  {
    id: "n1a2b3c4-d5e6-f789-0123-456789abcdef",
    type: "reply",
    title: "New reply to your post",
    message: "David Kim replied to your post about camera settings",
    timestamp: new Date("2024-01-25T15:45:00Z"),
    isRead: false,
    userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
  },
  {
    id: "n2b3c4d5-e6f7-g890-1234-567890bcdefg",
    type: "mention",
    title: "You were mentioned",
    message: "Emma Wilson mentioned you in Tech Discussions",
    timestamp: new Date("2024-01-24T17:30:00Z"),
    isRead: false,
    userId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    communityId: "tech-discussions",
  },
];

const REPORTS_TABLE: Report[] = [
  // Post report
  {
    id: "rep1a2b3-c4d5-e6f7-g890-123456789abc",
    contentType: "post",
    contentId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    contentPreview:
      "This post contains inappropriate language and violates community guidelines.",
    reportedBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    createdAt: new Date("2024-01-24T10:30:00Z"),
    reason: "Inappropriate content",
    status: "pending",
    content:
      "This post contains inappropriate language and violates community guidelines.",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
    originalContent: {
      title: "Best Camera Settings for Golden Hour Photography",
      community: "Photography Enthusiasts",
      author: "Alex Johnson",
      fullText:
        "Golden hour provides the most beautiful natural lighting for photography...",
    },
  },
  // Reply report
  {
    id: "rep2b3c4-d5e6-f789-0123-456789abcdef",
    contentType: "reply",
    contentId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    contentPreview: "This reply is spam and not relevant to the discussion.",
    reportedBy: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    createdAt: new Date("2024-01-25T11:00:00Z"),
    reason: "Spam reply",
    status: "reviewed",
    content: "This reply is spam and not relevant to the discussion.",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    replyId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
    originalContent: {
      parentPost: "Best Camera Settings for Golden Hour Photography",
      author: "David Kim",
      fullText:
        "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    },
  },
  // User report
  {
    id: "rep3c4d5-e6f7-g890-1234-567890bcdefg",
    contentType: "user",
    contentId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    contentPreview:
      "User has been sending harassing messages to other members.",
    reportedBy: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    createdAt: new Date("2024-01-26T09:15:00Z"),
    reason: "Harassment",
    status: "resolved",
    content: "User has been sending harassing messages to other members.",
    userId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    communityId: "photography-enthusiasts",
    originalContent: {
      name: "David Kim",
      email: "david.kim@example.com",
      role: "user",
      bio: "Travel blogger and photographer",
      fullText: "Direct message content here.",
    },
  },
  // Reply report with details
  {
    id: "rep4d5e6-f7g8-h901-2345-678901cdefgh",
    contentType: "reply",
    contentId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    contentPreview:
      "This reply contains offensive language directed at another user.",
    reportedBy: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    createdAt: new Date("2024-01-27T13:45:00Z"),
    reason: "Offensive language",
    status: "pending",
    content: "This reply contains offensive language directed at another user.",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    replyId: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    communityId: "photography-enthusiasts",
    originalContent: {
      parentPost: "Best Camera Settings for Golden Hour Photography",
      author: "David Kim",
      fullText: "You're clueless if you think that's the best setting.",
    },
  },
  // User report with details
  {
    id: "rep5e6f7-g8h9-i012-3456-789012defghi",
    contentType: "user",
    contentId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    contentPreview: "This user is impersonating another community member.",
    reportedBy: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    createdAt: new Date("2024-01-27T14:10:00Z"),
    reason: "Impersonation",
    status: "pending",
    content: "This user is impersonating another community member.",
    userId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    communityId: "tech-discussions",
    originalContent: {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "moderator",
      bio: "Tech enthusiast and community moderator",
      fullText: "Impersonation details here.",
    },
  },
];

// Helper function to get user name by ID
const getUserNameById = (userId: string): string => {
  const user = USERS_TABLE.find((u) => u.id === userId);
  return user ? user.name : userId;
};

// Patch report mocks to use names for reportedBy and add original links
REPORTS_TABLE.forEach((report) => {
  if (report.reportedBy && report.reportedBy.length > 20) {
    report.reportedBy = getUserNameById(report.reportedBy);
  }
  // Add a link to the original content
  if (report.contentType === "post" && report.postId && report.communityId) {
    report.originalLink = `/community/${report.communityId}/post/${report.postId}`;
  } else if (
    report.contentType === "reply" &&
    report.postId &&
    report.replyId &&
    report.communityId
  ) {
    report.originalLink = `/community/${report.communityId}/post/${report.postId}#reply-${report.replyId}`;
  } else if (report.contentType === "user" && report.userId) {
    report.originalLink = `/user/${report.userId}`;
  }
});

// Helper function to get community name by slug
const getCommunityNameBySlug = (slug: string): string => {
  const community = COMMUNITIES_TABLE.find((c) => c.slug === slug);
  return community ? community.name : "Unknown Community";
};

// API Functions with proper relationship mapping
export const api = {
  getPosts: async (): Promise<Post[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return POSTS_TABLE.map((post) => ({
      ...post,
      author: getUserNameById(post.author),
    }));
  },

  getPostDetail: async (
    postId: string
  ): Promise<PostDetailData | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const post = POSTS_TABLE.find((post) => post.id === postId);
    if (!post) return undefined;

    const replies: PostDetailReply[] = REPLIES_TABLE.filter(
      (reply) => reply.postId === postId
    ).map((reply) => ({
      id: reply.id,
      author: getUserNameById(reply.author),
      content: reply.content,
      timestamp: reply.createdAt,
      likes: reply.likes,
      isLiked: false,
      replies: [],
    }));

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: getUserNameById(post.author),
      timestamp: post.createdAt,
      likes: post.likes,
      comments: replies.length,
      isLiked: post.isLiked,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: [],
      replies: replies,
      communityId: post.communityId,
      communityName: post.communityName,
    };
  },

  getReports: async (): Promise<Report[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return REPORTS_TABLE;
  },

  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return USERS_TABLE;
  },

  getCommunities: async (): Promise<Community[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return COMMUNITIES_TABLE;
  },

  getHotPosts: async (): Promise<Post[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return POSTS_TABLE.filter((post) => post.isHot).map((post) => ({
      ...post,
      author: getUserNameById(post.author),
      communityName: getCommunityNameBySlug(post.communityId),
    }));
  },

  getCommunityPosts: async (
    communitySlug: string
  ): Promise<CommunityPost[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return POSTS_TABLE.filter((post) => post.communityId === communitySlug).map(
      (post) => ({
        id: post.id,
        name: post.communityName,
        title: post.title,
        content: post.content,
        author: getUserNameById(post.author),
        timestamp: post.createdAt,
        likes: post.likes,
        comments: post.replies,
        isLiked: post.isLiked,
        isPinned: false,
        isLocked: false,
        commentsLocked: false,
        tags: [],
      })
    );
  },

  getCommunityDetail: async (
    communitySlug: string
  ): Promise<CommunityDetail | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const community = COMMUNITIES_TABLE.find((c) => c.slug === communitySlug);

    if (!community) return null;

    return {
      id: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      tags: community.tags,
      isMember: community.isJoined,
      isModerator:
        community.moderators?.includes(
          "b2c3d4e5-f6g7-8901-2345-678901bcdefg"
        ) || false,
      moderators:
        community.moderators?.map((modId) => {
          const user = USERS_TABLE.find((u) => u.id === modId);
          return {
            id: modId,
            name: user?.name || "Unknown User",
            role: "moderator",
            joinedAsModAt: new Date("2024-01-10T14:20:00Z"),
          };
        }) || [],
      rules: [
        "Be respectful to all community members",
        "Stay on topic and relevant to the community",
        "No spam or self-promotion without permission",
        "Use appropriate language and content",
        "Follow platform-wide community guidelines",
      ],
    };
  },

  createPost: async (
    communitySlug: string,
    postData: {
      title: string;
      content: string;
      tags?: string[];
    }
  ): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPost: Post = {
      id: `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: postData.title,
      content: postData.content,
      author: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      communityId: communitySlug,
      communityName: getCommunityNameBySlug(communitySlug),
      createdAt: new Date(),
      likes: 0,
      replies: 0,
      isLiked: false,
    };

    POSTS_TABLE.push(newPost);
    return newPost;
  },

  // Notification methods
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NOTIFICATIONS_TABLE;
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const notification = NOTIFICATIONS_TABLE.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
    }
  },

  // Report methods
  submitReport: async (
    reportData: Omit<Report, "id" | "createdAt" | "status">
  ): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newReport: Report = {
      id: `rep${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentType: reportData.contentType,
      contentId: reportData.contentId,
      contentPreview: reportData.contentPreview,
      reportedBy: reportData.reportedBy,
      createdAt: new Date(),
      reason: reportData.reason,
      status: "pending",
      content: reportData.content,
      postId: reportData.postId,
      replyId: reportData.replyId,
      userId: reportData.userId,
      communityId: reportData.communityId,
      originalContent: reportData.originalContent,
      originalLink: reportData.originalLink,
    };

    REPORTS_TABLE.push(newReport);
    return newReport;
  },

  // Admin methods
  getAdminRoles: async (): Promise<AdminRole[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const mapUser = (u: User): AdminRoleUser => ({
      id: u.id,
      name: u.name,
      email: u.email,
      joinDate: u.createdAt,
      communities: undefined, // Add if you have this info
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
        userCount: USERS_TABLE.filter((u) => u.role === "admin").length,
        users: USERS_TABLE.filter((u) => u.role === "admin").map(mapUser),
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
        userCount: USERS_TABLE.filter((u) => u.role === "moderator").length,
        users: USERS_TABLE.filter((u) => u.role === "moderator").map(mapUser),
        icon: "moderator",
        color: "bg-blue-500",
      },
      {
        name: "User",
        description: "Standard user access",
        permissions: ["Create posts", "Join communities", "Comment and like"],
        userCount: USERS_TABLE.filter((u) => u.role === "user").length,
        users: USERS_TABLE.filter((u) => u.role === "user")
          .slice(0, 5)
          .map(mapUser),
        icon: "user",
        color: "bg-green-500",
      },
    ];
  },

  getPendingAdminRoleChanges: async (): Promise<AdminRole[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },

  // Analytics methods
  getAnalyticsCommunities: async (): Promise<AnalyticsCommunity[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return COMMUNITIES_TABLE.map((c) => ({
      name: c.name,
      members: c.memberCount,
      posts: c.postCount,
      comments: c.postCount * 2, // Example
      activity: Math.floor(Math.random() * 100),
    }));
  },

  getPlatformStats: async (): Promise<PlatformStats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalUsers: USERS_TABLE.length,
      totalCommunities: COMMUNITIES_TABLE.length,
      totalPosts: POSTS_TABLE.length,
      totalReports: REPORTS_TABLE.length,
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

// Mock pending moderator role changes
export const mockPendingModeratorRoleChanges = [
  {
    id: "mod1a2b3-c4d5-e6f7-g890-123456789abc",
    user: {
      id: "e5f6g7h8-i9j0-1234-5678-901234efghij",
      name: "David Kim",
      email: "david.kim@example.com",
      joinDate: new Date("2024-01-12T11:30:00Z"),
      role: "user",
      status: "active",
      communities: ["entrepreneurs-united"],
    },
    requestedBy: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    requestedAt: new Date("2024-01-20T14:15:00Z"),
    newRole: "moderator",
    communityName: "Entrepreneurs United",
    status: "pending",
  },
];

// Export mockUsers for backward compatibility
export const mockUsers = USERS_TABLE;

// Mock flagged reports for moderation page
export const getMockFlaggedReports = async (): Promise<Report[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return REPORTS_TABLE.filter((report) => report.status === "pending");
};
