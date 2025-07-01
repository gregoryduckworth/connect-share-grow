
import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

// Helper function to transform Prisma user to our User type
const transformUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role.toLowerCase(),
  createdAt: user.createdAt,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  isSuspended: user.isSuspended,
  language: user.language,
  avatar: user.avatar,
  bio: user.bio,
  location: user.location,
});

// Helper function to transform Prisma post to our Post type
const transformPost = (post: any): Post => ({
  id: post.id,
  title: post.title,
  content: post.content,
  author: post.author?.name || post.authorId,
  communityId: post.communityId,
  communityName: post.community?.name || post.communityId,
  createdAt: post.createdAt,
  likes: post.likes,
  replies: post.replies,
  isLiked: post.isLiked,
  isHot: post.isHot,
});

export const prismaApi = {
  getPosts: async (): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        community: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return posts.map(transformPost);
  },

  getPostDetail: async (postId: string): Promise<PostDetailData | undefined> => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        community: true,
        postReplies: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!post) return undefined;

    const replies: PostDetailReply[] = post.postReplies.map((reply) => ({
      id: reply.id,
      author: reply.author.name,
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
      author: post.author.name,
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
      communityName: post.community.name,
    };
  },

  getReports: async (): Promise<Report[]> => {
    const reports = await prisma.report.findMany({
      include: {
        reporter: true,
        post: true,
        reply: true,
        community: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reports.map((report) => ({
      id: report.id,
      contentType: report.contentType as any,
      contentId: report.contentId,
      contentPreview: report.contentPreview,
      reportedBy: report.reporter.name,
      createdAt: report.createdAt,
      reason: report.reason,
      status: report.status as any,
      content: report.content,
      postId: report.postId,
      replyId: report.replyId,
      userId: report.userId,
      communityId: report.communityId,
      originalContent: {
        title: report.post?.title,
        community: report.community?.name,
        author: report.reporter.name,
        fullText: report.content,
      },
      originalLink: report.originalLink,
    }));
  },

  getUsers: async (): Promise<User[]> => {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return users.map(transformUser);
  },

  getCommunities: async (): Promise<Community[]> => {
    const communities = await prisma.community.findMany({
      include: {
        creator: true,
        moderators: true,
      },
      orderBy: {
        memberCount: 'desc',
      },
    });

    return communities.map((community) => ({
      slug: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      category: community.category,
      tags: community.tags,
      isJoined: community.isJoined,
      lastActivity: community.lastActivity,
      createdBy: community.createdBy,
      status: community.status,
      moderators: community.moderators.map((mod) => mod.id),
    }));
  },

  getHotPosts: async (): Promise<Post[]> => {
    const posts = await prisma.post.findMany({
      where: {
        isHot: true,
      },
      include: {
        author: true,
        community: true,
      },
      orderBy: {
        likes: 'desc',
      },
    });
    
    return posts.map(transformPost);
  },

  getCommunityPosts: async (communitySlug: string): Promise<CommunityPost[]> => {
    const posts = await prisma.post.findMany({
      where: {
        communityId: communitySlug,
      },
      include: {
        author: true,
        community: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      name: post.community.name,
      title: post.title,
      content: post.content,
      author: post.author.name,
      timestamp: post.createdAt,
      likes: post.likes,
      comments: post.replies,
      isLiked: post.isLiked,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: [],
    }));
  },

  getCommunityDetail: async (communitySlug: string): Promise<CommunityDetail | null> => {
    const community = await prisma.community.findUnique({
      where: { slug: communitySlug },
      include: {
        creator: true,
        moderators: true,
      },
    });

    if (!community) return null;

    return {
      id: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      tags: community.tags,
      isMember: community.isJoined,
      isModerator: community.moderators.some(mod => mod.id === "b2c3d4e5-f6g7-8901-2345-678901bcdefg"),
      moderators: community.moderators.map((mod) => ({
        id: mod.id,
        name: mod.name,
        role: "moderator",
        joinedAsModAt: new Date("2024-01-10T14:20:00Z"),
      })),
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
    const newPost = await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        authorId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        communityId: communitySlug,
      },
      include: {
        author: true,
        community: true,
      },
    });

    return transformPost(newPost);
  },

  getNotifications: async (): Promise<Notification[]> => {
    const notifications = await prisma.notification.findMany({
      include: {
        user: true,
        post: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      timestamp: notification.timestamp,
      isRead: notification.isRead,
      userId: notification.userId,
      postId: notification.postId,
      communityId: notification.communityId,
    }));
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  submitReport: async (
    reportData: Omit<Report, "id" | "createdAt" | "status">
  ): Promise<Report> => {
    const newReport = await prisma.report.create({
      data: {
        contentType: reportData.contentType,
        contentId: reportData.contentId,
        contentPreview: reportData.contentPreview,
        reportedBy: reportData.reportedBy,
        reason: reportData.reason,
        content: reportData.content,
        postId: reportData.postId,
        replyId: reportData.replyId,
        userId: reportData.userId,
        communityId: reportData.communityId,
        originalLink: reportData.originalLink,
      },
      include: {
        reporter: true,
        post: true,
        reply: true,
        community: true,
      },
    });

    return {
      id: newReport.id,
      contentType: newReport.contentType as any,
      contentId: newReport.contentId,
      contentPreview: newReport.contentPreview,
      reportedBy: newReport.reporter.name,
      createdAt: newReport.createdAt,
      reason: newReport.reason,
      status: newReport.status as any,
      content: newReport.content,
      postId: newReport.postId,
      replyId: newReport.replyId,
      userId: newReport.userId,
      communityId: newReport.communityId,
      originalContent: {
        title: newReport.post?.title,
        community: newReport.community?.name,
        author: newReport.reporter.name,
        fullText: newReport.content,
      },
      originalLink: newReport.originalLink,
    };
  },

  getAdminRoles: async (): Promise<AdminRole[]> => {
    const users = await prisma.user.findMany();
    
    const mapUser = (u: any): AdminRoleUser => ({
      id: u.id,
      name: u.name,
      email: u.email,
      joinDate: u.createdAt,
      communities: undefined,
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
        userCount: users.filter((u) => u.role === "ADMIN").length,
        users: users.filter((u) => u.role === "ADMIN").map(mapUser),
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
        userCount: users.filter((u) => u.role === "MODERATOR").length,
        users: users.filter((u) => u.role === "MODERATOR").map(mapUser),
        icon: "moderator",
        color: "bg-blue-500",
      },
      {
        name: "User",
        description: "Standard user access",
        permissions: ["Create posts", "Join communities", "Comment and like"],
        userCount: users.filter((u) => u.role === "USER").length,
        users: users.filter((u) => u.role === "USER")
          .slice(0, 5)
          .map(mapUser),
        icon: "user",
        color: "bg-green-500",
      },
    ];
  },

  getPendingAdminRoleChanges: async (): Promise<AdminRole[]> => {
    return [];
  },

  getAnalyticsCommunities: async (): Promise<AnalyticsCommunity[]> => {
    const communities = await prisma.community.findMany({
      include: {
        posts: true,
      },
    });

    return communities.map((c) => ({
      name: c.name,
      members: c.memberCount,
      posts: c.postCount,
      comments: c.posts.reduce((sum, post) => sum + post.replies, 0),
      activity: Math.floor(Math.random() * 100),
    }));
  },

  getPlatformStats: async (): Promise<PlatformStats> => {
    const [userCount, communityCount, postCount, reportCount] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.post.count(),
      prisma.report.count(),
    ]);

    return {
      totalUsers: userCount,
      totalCommunities: communityCount,
      totalPosts: postCount,
      totalReports: reportCount,
    };
  },

  getActivityData: async (): Promise<ActivityDataPoint[]> => {
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
    return [
      { name: "Small (1-100)", value: 45, color: "#8884d8" },
      { name: "Medium (101-500)", value: 30, color: "#82ca9d" },
      { name: "Large (501-1000)", value: 20, color: "#ffc658" },
      { name: "Very Large (1000+)", value: 5, color: "#ff8042" },
    ];
  },
};

// Mock pending moderator role changes for compatibility
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

export const getMockFlaggedReports = async (): Promise<Report[]> => {
  return prismaApi.getReports().then(reports => 
    reports.filter(report => report.status === "pending")
  );
};
