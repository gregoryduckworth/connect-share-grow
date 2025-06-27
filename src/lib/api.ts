import type { Post, Community, User, Reply, Notification, AdminNotification, Report, Connection, ChatMessage, PostDetailData, PostDetailReply, CommunityDetail, CommunityPost } from "./types";

// Mock Database Tables - separated by type for easier management
const USERS_TABLE: User[] = [
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
    location: "San Francisco, CA"
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
    location: "New York, NY"
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
    location: "Austin, TX"
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
    location: "Seattle, WA"
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
    location: "Los Angeles, CA"
  }
];

const COMMUNITIES_TABLE: Community[] = [
  {
    slug: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description: "A community for photographers of all skill levels to share tips, techniques, and showcase their work.",
    memberCount: 1247,
    postCount: 89,
    category: "Creative Arts",
    tags: ["photography", "art", "creative", "digital"],
    isJoined: true,
    lastActivity: new Date("2024-01-25T14:30:00Z"),
    createdBy: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    status: "active",
    moderators: ["b2c3d4e5-f6g7-8901-2345-678901bcdefg"]
  },
  {
    slug: "tech-discussions",
    name: "Tech Discussions",
    description: "Discuss the latest trends in technology, programming languages, and software development.",
    memberCount: 2156,
    postCount: 234,
    category: "Technology",
    tags: ["tech", "programming", "software", "development"],
    isJoined: true,
    lastActivity: new Date("2024-01-24T16:20:00Z"),
    createdBy: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    status: "active",
    moderators: ["b2c3d4e5-f6g7-8901-2345-678901bcdefg", "d4e5f6g7-h8i9-0123-4567-890123defghi"]
  },
  {
    slug: "fitness-wellness",
    name: "Fitness & Wellness",
    description: "Share workout routines, nutrition tips, and wellness advice for a healthier lifestyle.",
    memberCount: 892,
    postCount: 156,
    category: "Health & Fitness",
    tags: ["fitness", "health", "wellness", "nutrition"],
    isJoined: false,
    lastActivity: new Date("2024-01-23T12:45:00Z"),
    createdBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    status: "active",
    moderators: ["c3d4e5f6-g7h8-9012-3456-789012cdefgh"]
  },
  {
    slug: "travel-adventures",
    name: "Travel Adventures",
    description: "Share your travel experiences, tips, and discover new destinations around the world.",
    memberCount: 1534,
    postCount: 201,
    category: "Travel & Lifestyle",
    tags: ["travel", "adventure", "destinations", "culture"],
    isJoined: false,
    lastActivity: new Date("2024-01-22T18:15:00Z"),
    createdBy: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    status: "active",
    moderators: ["e5f6g7h8-i9j0-1234-5678-901234efghij"]
  }
];

const POSTS_TABLE: Post[] = [
  {
    id: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    title: "Best Camera Settings for Golden Hour Photography",
    content: "Golden hour provides the most beautiful natural lighting for photography. Here are my recommended camera settings: Use a wide aperture (f/1.4-f/2.8) for shallow depth of field, keep ISO low (100-400) to minimize noise, and adjust shutter speed based on your subject movement. Don't forget to shoot in RAW format for maximum editing flexibility!",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-01-25T14:30:00Z"),
    likes: 45,
    replies: 12,
    isLiked: true,
    isHot: true
  },
  {
    id: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    title: "The Future of React Server Components",
    content: "React Server Components are revolutionizing how we think about server-side rendering and client-side interactivity. This new paradigm allows us to run components on the server, reducing bundle size and improving performance. Let's discuss the implications and best practices for implementing RSCs in production applications.",
    author: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
    communityId: "tech-discussions",
    communityName: "Tech Discussions",
    createdAt: new Date("2024-01-24T16:20:00Z"),
    likes: 67,
    replies: 18,
    isLiked: false,
    isHot: true
  },
  {
    id: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
    title: "My 30-Day Fitness Transformation Journey",
    content: "I wanted to share my incredible 30-day fitness transformation journey with everyone. Through consistent daily workouts, proper nutrition planning, and staying motivated, I've seen amazing results. Here's my detailed workout routine, meal plans, and the mindset shifts that made all the difference.",
    author: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
    communityId: "fitness-wellness",
    communityName: "Fitness & Wellness",
    createdAt: new Date("2024-01-23T12:45:00Z"),
    likes: 23,
    replies: 8,
    isLiked: false
  },
  {
    id: "p4d5e6f7-g8h9-i012-3456-789012defghi",
    title: "Hidden Gems in Southeast Asia",
    content: "Just returned from an amazing backpacking trip through Southeast Asia! I discovered some incredible hidden gems that aren't in typical travel guides. From secluded beaches in the Philippines to mountain villages in Vietnam, here are my top 10 off-the-beaten-path destinations that every traveler should consider.",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    communityId: "travel-adventures",
    communityName: "Travel Adventures",
    createdAt: new Date("2024-01-22T18:15:00Z"),
    likes: 34,
    replies: 15,
    isLiked: true
  }
];

const REPLIES_TABLE: Reply[] = [
  {
    id: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
    content: "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
    author: "e5f6g7h8-i9j0-1234-5678-901234efghij",
    postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
    createdAt: new Date("2024-01-25T15:45:00Z"),
    likes: 8,
    parentReplyId: null
  },
  {
    id: "r2b3c4d5-e6f7-g890-1234-567890bcdefg",
    content: "RSCs are game-changing! We've implemented them in our production app and saw a 40% reduction in bundle size.",
    author: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
    createdAt: new Date("2024-01-24T17:30:00Z"),
    likes: 12,
    parentReplyId: null
  },
  {
    id: "r3c4d5e6-f7g8-h901-2345-678901cdefgh",
    content: "Amazing transformation! What was your biggest challenge during the 30 days?",
    author: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    postId: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
    createdAt: new Date("2024-01-23T14:20:00Z"),
    likes: 3,
    parentReplyId: null
  }
];

// Helper function to get user name by ID
const getUserNameById = (userId: string): string => {
  const user = USERS_TABLE.find(u => u.id === userId);
  return user ? user.name : "Unknown User";
};

// Helper function to get community name by slug
const getCommunityNameBySlug = (slug: string): string => {
  const community = COMMUNITIES_TABLE.find(c => c.slug === slug);
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
  getPostDetail: async (postId: string): Promise<PostDetailData | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const post = POSTS_TABLE.find((post) => post.id === postId);
    if (!post) return undefined;

    // Fetch replies for the post
    const replies: PostDetailReply[] = REPLIES_TABLE.filter(
      (reply) => reply.postId === postId
    ).map((reply) => ({
      id: reply.id,
      author: getUserNameById(reply.author),
      content: reply.content,
      timestamp: reply.createdAt,
      likes: reply.likes,
      isLiked: false,
      replies: [], // Mocked as no nested replies in this example
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
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: "rep1a2b3-c4d5-e6f7-g890-123456789abc",
        type: "post",
        reportedBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        reportedAt: new Date("2024-01-24T10:30:00Z"),
        reason: "Inappropriate content",
        status: "pending",
        content: "This post contains inappropriate language and violates community guidelines.",
        postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        communityId: "photography-enthusiasts"
      }
    ];
  },
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return USERS_TABLE;
  },
  getCommunities: async (): Promise<Community[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return COMMUNITIES_TABLE;
  },
  getHotPosts: async (): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return POSTS_TABLE
      .filter(post => post.isHot)
      .map(post => ({
        ...post,
        author: getUserNameById(post.author),
        communityName: getCommunityNameBySlug(post.communityId)
      }));
  },
  getCommunityPosts: async (communitySlug: string): Promise<CommunityPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return POSTS_TABLE
      .filter(post => post.communityId === communitySlug)
      .map(post => ({
        id: post.id,
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
        tags: []
      }));
  },
  getCommunityDetail: async (communitySlug: string): Promise<CommunityDetail | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const community = COMMUNITIES_TABLE.find(c => c.slug === communitySlug);
    
    if (!community) return null;
    
    return {
      id: community.slug,
      name: community.name,
      description: community.description,
      memberCount: community.memberCount,
      postCount: community.postCount,
      tags: community.tags,
      isMember: community.isJoined,
      isModerator: community.moderators?.includes("b2c3d4e5-f6g7-8901-2345-678901bcdefg") || false,
      moderators: community.moderators?.map(modId => {
        const user = USERS_TABLE.find(u => u.id === modId);
        return {
          id: modId,
          name: user?.name || "Unknown User",
          role: "moderator",
          joinedAsModAt: new Date("2024-01-10T14:20:00Z")
        };
      }) || [],
      rules: [
        "Be respectful to all community members",
        "Stay on topic and relevant to the community",
        "No spam or self-promotion without permission",
        "Use appropriate language and content",
        "Follow platform-wide community guidelines"
      ]
    };
  },
  createPost: async (communitySlug: string, postData: {
    title: string;
    content: string;
    tags?: string[];
  }): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: postData.title,
      content: postData.content,
      author: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Current user ID
      communityId: communitySlug,
      communityName: getCommunityNameBySlug(communitySlug),
      createdAt: new Date(),
      likes: 0,
      replies: 0,
      isLiked: false
    };
    
    POSTS_TABLE.push(newPost);
    return newPost;
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
      communities: ["travel-adventures"]
    },
    requestedBy: "d4e5f6g7-h8i9-0123-4567-890123defghi",
    requestedAt: new Date("2024-01-20T14:15:00Z"),
    newRole: "moderator",
    communityName: "Travel Adventures",
    status: "pending"
  }
];
