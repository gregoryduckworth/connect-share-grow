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

// Generate consistent UUIDs for mock data
const generateUUID = (seed: string): string => {
  // Simple deterministic UUID generator for consistent mock data
  const hash = seed.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(
    1,
    4
  )}-a${hex.slice(1, 4)}-${hex.slice(0, 12)}`;
};

// User UUIDs
const USER_IDS = {
  ADMIN: generateUUID("admin-user"),
  REGULAR: generateUUID("regular-user"),
  SUSPENDED: generateUUID("suspended-user"),
  UNVERIFIED: generateUUID("unverified-user"),
  MODERATOR: generateUUID("moderator-user"),
  USER_3: generateUUID("user-3"),
  USER_4: generateUUID("user-4"),
  USER_5: generateUUID("user-5"),
};

// Community UUIDs
const COMMUNITY_IDS = {
  WEB_DEV: generateUUID("web-development"),
  PHOTOGRAPHY: generateUUID("photography-enthusiasts"),
  SUSTAINABLE: generateUUID("sustainable-living"),
  INDIE_GAME: generateUUID("indie-game-dev"),
  ECO_LIVING: generateUUID("eco-living"),
  AI_ARTISTS: generateUUID("ai-artists"),
};

// Post UUIDs
const POST_IDS = {
  POST_1: generateUUID("future-web-dev"),
  POST_2: generateUUID("photo-spots-city"),
  POST_3: generateUUID("camera-gear-rec"),
  POST_4: generateUUID("sustainable-tips"),
  POST_5: generateUUID("ai-indie-games"),
};

// Mock data storage
// --- USERS ---
export const mockUsers: User[] = [
  {
    id: USER_IDS.ADMIN,
    email: "admin@example.com",
    name: "Admin User",
    role: "admin" as const,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    createdAt: new Date("2024-01-15T10:00:00Z"),
    isActive: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    bio: "Platform administrator ensuring smooth operations.",
    location: "San Francisco, CA",
  },
  {
    id: USER_IDS.REGULAR,
    email: "user@example.com",
    name: "John Doe",
    role: "user" as const,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    createdAt: new Date("2024-02-20T14:30:00Z"),
    isActive: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    bio: "Tech enthusiast and web developer passionate about React and Node.js.",
    location: "New York, NY",
  },
  {
    id: USER_IDS.SUSPENDED,
    email: "suspended@example.com",
    name: "Suspended User",
    role: "user" as const,
    isEmailVerified: true,
    isSuspended: true,
    suspensionReason:
      "Violation of community guidelines - repeated inappropriate behavior",
    language: "en",
    createdAt: new Date("2024-03-10T09:15:00Z"),
    isActive: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=suspended",
  },
  {
    id: USER_IDS.UNVERIFIED,
    email: "unverified@example.com",
    name: "Unverified User",
    role: "user" as const,
    isEmailVerified: false,
    isSuspended: false,
    language: "en",
    createdAt: new Date("2024-06-01T16:45:00Z"),
    isActive: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=unverified",
  },
  {
    id: USER_IDS.MODERATOR,
    email: "moderator@example.com",
    name: "Alice Johnson",
    role: "moderator" as const,
    isEmailVerified: true,
    isSuspended: false,
    language: "en",
    createdAt: new Date("2024-01-25T11:20:00Z"),
    isActive: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    bio: "Photography enthusiast and community moderator.",
    location: "Los Angeles, CA",
  },
];

// Utility functions for user lookup
export function getUserByEmail(email: string) {
  return mockUsers.find((u) => u.email === email);
}
export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id);
}

// --- COMMUNITIES ---
const mockCommunities: Community[] = [
  {
    slug: "web-development",
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    tags: ["JavaScript", "React", "Node.js", "TypeScript", "Frontend"],
    isJoined: false,
    lastActivity: new Date("2024-06-21T15:30:00Z"),
    status: "active",
    moderators: [USER_IDS.REGULAR],
    createdBy: USER_IDS.REGULAR,
    requestedAt: new Date("2024-03-10T08:00:00Z"),
  },
  {
    slug: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    category: "Creative",
    tags: ["Photography", "Camera", "Editing", "Portrait", "Landscape"],
    isJoined: true,
    lastActivity: new Date("2024-06-22T12:45:00Z"),
    status: "active",
    moderators: [USER_IDS.MODERATOR],
    createdBy: USER_IDS.MODERATOR,
    requestedAt: new Date("2024-02-15T10:30:00Z"),
  },
  {
    slug: "sustainable-living",
    name: "Sustainable Living",
    description: "Tips and discussions about eco-friendly lifestyle choices",
    memberCount: 1456,
    postCount: 321,
    category: "Lifestyle",
    tags: ["Eco", "Green", "Sustainability", "Environment", "Climate"],
    isJoined: false,
    lastActivity: new Date("2024-06-23T09:20:00Z"),
    status: "active",
    moderators: [USER_IDS.USER_3],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-04-01T14:15:00Z"),
  },
  {
    slug: "indie-game-dev",
    name: "Indie Game Development",
    description:
      "For independent game developers to share experiences and resources",
    memberCount: 987,
    postCount: 210,
    category: "Gaming",
    tags: ["Games", "Indie", "Development", "Unity", "Godot"],
    isJoined: false,
    lastActivity: new Date("2024-06-24T18:10:00Z"),
    status: "active",
    moderators: [USER_IDS.REGULAR],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-05-10T16:00:00Z"),
  },
  {
    slug: "tech-innovators",
    name: "Tech Innovators",
    description: "Discussing the latest in technology and innovation",
    memberCount: 890,
    postCount: 0,
    category: "Technology",
    tags: ["Technology", "Innovation", "Startups"],
    isJoined: false,
    lastActivity: new Date("2024-06-20T10:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.REGULAR,
    requestedAt: new Date("2024-06-20T10:00:00Z"),
  },
  {
    slug: "cooking-adventures",
    name: "Cooking Adventures",
    description: "Share recipes, cooking tips, and culinary experiences",
    memberCount: 2100,
    postCount: 0,
    category: "Lifestyle",
    tags: ["Cooking", "Recipes", "Food"],
    isJoined: true,
    lastActivity: new Date("2024-06-19T09:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-19T09:00:00Z"),
  },
  {
    slug: "travel-stories",
    name: "Travel Stories",
    description: "Share your travel experiences and get recommendations",
    memberCount: 756,
    postCount: 0,
    category: "Lifestyle",
    tags: ["Travel", "Adventure", "Culture"],
    isJoined: false,
    lastActivity: new Date("2024-06-18T08:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-18T08:00:00Z"),
  },
  {
    slug: "fitness-health",
    name: "Fitness & Health",
    description: "Tips, motivation, and discussions about fitness and health",
    memberCount: 1543,
    postCount: 0,
    category: "Lifestyle",
    tags: ["Fitness", "Health", "Wellness"],
    isJoined: true,
    lastActivity: new Date("2024-06-17T07:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-17T07:00:00Z"),
  },
  {
    slug: "book-club",
    name: "Book Club",
    description: "Monthly book discussions and reading recommendations",
    memberCount: 432,
    postCount: 0,
    category: "Literature",
    tags: ["Books", "Reading", "Literature"],
    isJoined: false,
    lastActivity: new Date("2024-06-16T06:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-16T06:00:00Z"),
  },
  {
    slug: "gaming-hub",
    name: "Gaming Hub",
    description: "Discuss games, share gameplay, and find gaming partners",
    memberCount: 2890,
    postCount: 0,
    category: "Gaming",
    tags: ["Gaming", "Entertainment", "Community"],
    isJoined: false,
    lastActivity: new Date("2024-06-15T05:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-15T05:00:00Z"),
  },
  {
    slug: "art-design",
    name: "Art & Design",
    description: "Showcase artwork and discuss design principles",
    memberCount: 1120,
    postCount: 0,
    category: "Creative",
    tags: ["Art", "Design", "Creative"],
    isJoined: false,
    lastActivity: new Date("2024-06-14T04:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-14T04:00:00Z"),
  },
  {
    slug: "music-makers",
    name: "Music Makers",
    description:
      "A community for musicians and music lovers to collaborate and share.",
    memberCount: 980,
    postCount: 0,
    category: "Music",
    tags: ["Music", "Collaboration", "Instruments"],
    isJoined: false,
    lastActivity: new Date("2024-06-13T03:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-13T03:00:00Z"),
  },
  {
    slug: "parenting-support",
    name: "Parenting Support",
    description: "Advice and support for parents at every stage.",
    memberCount: 760,
    postCount: 0,
    category: "Family",
    tags: ["Parenting", "Family", "Support"],
    isJoined: false,
    lastActivity: new Date("2024-06-12T02:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-12T02:00:00Z"),
  },
  {
    slug: "entrepreneurs-united",
    name: "Entrepreneurs United",
    description: "Connect with fellow entrepreneurs and share business tips.",
    memberCount: 2105,
    postCount: 0,
    category: "Business",
    tags: ["Business", "Entrepreneurship", "Startups"],
    isJoined: false,
    lastActivity: new Date("2024-06-11T01:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-11T01:00:00Z"),
  },
  {
    slug: "pet-lovers",
    name: "Pet Lovers",
    description: "Share stories, tips, and photos of your pets.",
    memberCount: 1580,
    postCount: 0,
    category: "Lifestyle",
    tags: ["Pets", "Animals", "Care"],
    isJoined: false,
    lastActivity: new Date("2024-06-10T00:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-10T00:00:00Z"),
  },
  {
    slug: "language-exchange",
    name: "Language Exchange",
    description: "Practice and learn new languages with others.",
    memberCount: 1200,
    postCount: 0,
    category: "Education",
    tags: ["Languages", "Learning", "Exchange"],
    isJoined: false,
    lastActivity: new Date("2024-06-09T23:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-09T23:00:00Z"),
  },
  {
    slug: "film-buffs",
    name: "Film Buffs",
    description: "Discuss movies, directors, and the art of filmmaking.",
    memberCount: 890,
    postCount: 0,
    category: "Entertainment",
    tags: ["Movies", "Film", "Discussion"],
    isJoined: false,
    lastActivity: new Date("2024-06-08T22:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-08T22:00:00Z"),
  },
  {
    slug: "science-explorers",
    name: "Science Explorers",
    description: "Explore the wonders of science and discovery.",
    memberCount: 1010,
    postCount: 0,
    category: "Science",
    tags: ["Science", "Discovery", "Learning"],
    isJoined: false,
    lastActivity: new Date("2024-06-07T21:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-07T21:00:00Z"),
  },
  {
    slug: "mindfulness-meditation",
    name: "Mindfulness & Meditation",
    description: "Share mindfulness practices and meditation tips.",
    memberCount: 670,
    postCount: 0,
    category: "Wellness",
    tags: ["Mindfulness", "Meditation", "Wellness"],
    isJoined: false,
    lastActivity: new Date("2024-06-06T20:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-06T20:00:00Z"),
  },
  {
    slug: "home-gardeners",
    name: "Home Gardeners",
    description: "Tips and inspiration for home gardening enthusiasts.",
    memberCount: 940,
    postCount: 0,
    category: "Lifestyle",
    tags: ["Gardening", "Plants", "Home"],
    isJoined: false,
    lastActivity: new Date("2024-06-05T19:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-05T19:00:00Z"),
  },
  {
    slug: "cycling-community",
    name: "Cycling Community",
    description: "Connect with cyclists and share your rides.",
    memberCount: 800,
    postCount: 0,
    category: "Fitness",
    tags: ["Cycling", "Fitness", "Outdoors"],
    isJoined: false,
    lastActivity: new Date("2024-06-04T18:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-04T18:00:00Z"),
  },
  {
    slug: "board-game-society",
    name: "Board Game Society",
    description: "Discuss and play board games with others.",
    memberCount: 540,
    postCount: 0,
    category: "Entertainment",
    tags: ["Board Games", "Fun", "Strategy"],
    isJoined: false,
    lastActivity: new Date("2024-06-03T17:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-03T17:00:00Z"),
  },
];

// --- POSTS ---
const mockPosts: Post[] = [
  {
    id: POST_IDS.POST_1,
    title: "The Future of Web Development",
    content:
      "What do you think about the latest trends in web development? AI integration seems to be everywhere now, and frameworks are evolving rapidly. How are you adapting to these changes?",
    author: "John Doe",
    communityId: "web-development",
    communityName: "Web Development",
    createdAt: new Date("2024-06-22T10:30:00Z"),
    likes: 45,
    replies: 12,
    isHot: true,
    isLiked: false,
  },
  {
    id: POST_IDS.POST_2,
    title: "Best Photography Spots in the City",
    content:
      "I've been exploring the city and found some amazing spots for photography. Here are my top recommendations with specific locations and best times to visit.",
    author: "Alice Johnson",
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-06-21T14:20:00Z"),
    likes: 67,
    replies: 8,
    isHot: true,
    isLiked: false,
  },
  {
    id: POST_IDS.POST_3,
    title: "Camera Gear Recommendations for Beginners",
    content:
      "Looking for recommendations on the best camera gear for beginners. Budget is around $800-1200. Any suggestions for cameras, lenses, and essential accessories?",
    author: "Alice Johnson",
    communityId: "photography-enthusiasts",
    communityName: "Photography Enthusiasts",
    createdAt: new Date("2024-06-20T16:45:00Z"),
    likes: 23,
    replies: 6,
    isHot: false,
    isLiked: false,
  },
  {
    id: POST_IDS.POST_4,
    title: "Sustainable Living Tips for 2024",
    content:
      "Here are some practical ways to live more sustainably this year! From reducing plastic waste to energy-efficient home improvements.",
    author: "Bob Smith",
    communityId: "sustainable-living",
    communityName: "Sustainable Living",
    createdAt: new Date("2024-06-23T11:30:00Z"),
    likes: 88,
    replies: 15,
    isHot: true,
    isLiked: false,
  },
  {
    id: POST_IDS.POST_5,
    title: "AI Tools in Indie Game Development",
    content:
      "How are you using AI tools in your indie game projects? Share your experience with AI art generation, procedural content, and game design assistance!",
    author: "Carlos Rivera",
    communityId: "indie-game-dev",
    communityName: "Indie Game Development",
    createdAt: new Date("2024-06-24T13:15:00Z"),
    likes: 120,
    replies: 9,
    isHot: true,
    isLiked: false,
  },
];

// --- REPLIES (flat, with parentReplyId for nesting) ---
const mockReplies: Reply[] = [
  {
    id: generateUUID("reply-react-insights"),
    content:
      "Great insights! I've been working with React for years and the new features like Server Components are amazing. The ecosystem is evolving so fast!",
    author: "Alice Johnson",
    postId: POST_IDS.POST_1,
    parentReplyId: null,
    createdAt: new Date("2024-06-22T10:45:00Z"),
    likes: 12,
  },
  {
    id: generateUUID("reply-hooks-suspense"),
    content:
      "Absolutely! Hooks and Suspense have completely changed the way I write components. The mental model is so much cleaner now.",
    author: "Jane Smith",
    postId: POST_IDS.POST_1,
    parentReplyId: generateUUID("reply-react-insights"),
    createdAt: new Date("2024-06-22T11:00:00Z"),
    likes: 5,
  },
  {
    id: generateUUID("reply-typescript-better"),
    content:
      "And with TypeScript integration getting better every release, it's even more powerful!",
    author: "Carlos Rivera",
    postId: POST_IDS.POST_1,
    parentReplyId: generateUUID("reply-hooks-suspense"),
    createdAt: new Date("2024-06-22T11:15:00Z"),
    likes: 3,
  },
  {
    id: generateUUID("reply-server-components"),
    content:
      "Don't forget about Server Components! They're a game changer for performance.",
    author: "Bob Smith",
    postId: POST_IDS.POST_1,
    parentReplyId: generateUUID("reply-react-insights"),
    createdAt: new Date("2024-06-22T11:10:00Z"),
    likes: 2,
  },
  {
    id: generateUUID("reply-ai-frontend"),
    content:
      "AI is definitely the future. I'm curious how it will impact frontend frameworks in the next few years.",
    author: "Jane Smith",
    postId: POST_IDS.POST_1,
    parentReplyId: null,
    createdAt: new Date("2024-06-22T12:00:00Z"),
    likes: 7,
  },
];

// --- DATABASE-LIKE STRUCTURED DATA ---

// Notification types as they would appear in a database
const mockNotifications: Notification[] = [
  {
    id: generateUUID("notif-reply-post"),
    type: "reply",
    title: "New reply to your post",
    message:
      "Alice Johnson replied to your post 'The Future of Web Development'",
    timestamp: new Date("2024-06-20T14:30:00Z"),
    isRead: false,
    postId: POST_IDS.POST_1,
    communityId: COMMUNITY_IDS.WEB_DEV,
    userId: USER_IDS.MODERATOR,
  },
  {
    id: generateUUID("notif-comment-post"),
    type: "comment",
    title: "New comment on your post",
    message: "John Doe commented on your post 'Best Photography Spots'",
    timestamp: new Date("2024-06-20T12:15:00Z"),
    isRead: false,
    postId: POST_IDS.POST_2,
    communityId: COMMUNITY_IDS.PHOTOGRAPHY,
    userId: USER_IDS.REGULAR,
  },
  {
    id: generateUUID("notif-mention-user"),
    type: "mention",
    title: "You were mentioned",
    message: "You were mentioned in a discussion about camera recommendations",
    timestamp: new Date("2024-06-19T16:45:00Z"),
    isRead: true,
    postId: POST_IDS.POST_3,
    communityId: COMMUNITY_IDS.PHOTOGRAPHY,
    userId: USER_IDS.MODERATOR,
  },
];

const mockAdminNotifications: AdminNotification[] = [
  {
    id: generateUUID("admin-community-pending"),
    type: "community_approval",
    title: "New Community Pending Approval",
    message: "Eco Living community is awaiting approval from administrators",
    timestamp: new Date("2024-06-20T16:30:00Z"),
    isRead: false,
    priority: "medium",
  },
  {
    id: generateUUID("admin-user-report"),
    type: "user_report",
    title: "High Priority User Report",
    message: "User reported for inappropriate content in Photography community",
    timestamp: new Date("2024-06-20T15:45:00Z"),
    isRead: false,
    priority: "high",
  },
];

const mockReports: Report[] = [
  {
    id: generateUUID("report-spam-post"),
    type: "post",
    reportedBy: USER_IDS.REGULAR,
    reportedAt: new Date("2024-06-20T10:30:00Z"),
    reason: "Spam content - promotional material without disclosure",
    status: "pending",
    content: "This post contains undisclosed promotional content",
    postId: POST_IDS.POST_1,
    communityId: COMMUNITY_IDS.WEB_DEV,
    originalContent:
      "Check out this amazing new framework that will revolutionize web development! [Contains affiliate links]",
  },
  {
    id: generateUUID("report-harassment-reply"),
    type: "reply",
    reportedBy: USER_IDS.MODERATOR,
    reportedAt: new Date("2024-06-19T14:20:00Z"),
    reason: "Harassment and personal attacks against community members",
    status: "reviewed",
    content: "Harassing comment targeting another user with personal attacks",
    replyId: generateUUID("reply-react-insights"),
    postId: POST_IDS.POST_2,
    communityId: COMMUNITY_IDS.PHOTOGRAPHY,
    originalContent:
      "Your photos are terrible and you should stop posting here. You have no talent.",
  },
];

const mockConnections: Connection[] = [
  {
    id: generateUUID("conn-john-alice"),
    fromUserId: USER_IDS.REGULAR,
    toUserId: USER_IDS.MODERATOR,
    fromUserName: "John Doe",
    toUserName: "Alice Johnson",
    message:
      "Hi Alice! I'd love to connect and discuss photography techniques. Your recent posts have been really inspiring!",
    status: "accepted",
    requestedAt: new Date("2024-06-15T09:30:00Z"),
    respondedAt: new Date("2024-06-16T14:20:00Z"),
  },
  {
    id: generateUUID("conn-bob-john"),
    fromUserId: USER_IDS.USER_3,
    toUserId: USER_IDS.REGULAR,
    fromUserName: "Bob Smith",
    toUserName: "John Doe",
    message:
      "Would like to connect for potential collaboration on web development projects. I noticed we have similar interests.",
    status: "pending",
    requestedAt: new Date("2024-06-20T16:45:00Z"),
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: generateUUID("msg-thanks-connection"),
    connectionId: generateUUID("conn-john-alice"),
    senderId: USER_IDS.REGULAR,
    content:
      "Hey Alice! Thanks for accepting my connection request. I'm really excited to learn from your photography expertise.",
    sentAt: new Date("2024-06-16T14:30:00Z"),
    isRead: true,
  },
  {
    id: generateUUID("msg-photography-tips"),
    connectionId: generateUUID("conn-john-alice"),
    senderId: USER_IDS.MODERATOR,
    content:
      "No problem, John! I'm always happy to share photography tips. What specific areas are you most interested in learning about?",
    sentAt: new Date("2024-06-16T14:45:00Z"),
    isRead: true,
  },
];

// Mock pending moderator role changes with proper UUIDs
export const mockPendingModeratorRoleChanges = [
  {
    id: generateUUID("modrole-jane-smith"),
    user: {
      id: USER_IDS.USER_4,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      joinDate: new Date("2024-03-10T10:00:00Z"),
      role: "user",
      status: "active",
      communities: ["Photography Enthusiasts"],
    },
    requestedBy: USER_IDS.MODERATOR,
    requestedAt: new Date("2024-06-20T09:15:00Z"),
    newRole: "moderator",
    communityName: "Photography Enthusiasts",
    status: "pending",
  },
  {
    id: generateUUID("modrole-carlos-rivera"),
    user: {
      id: USER_IDS.USER_5,
      name: "Carlos Rivera",
      email: "carlos.rivera@example.com",
      joinDate: new Date("2024-02-05T12:30:00Z"),
      role: "user",
      status: "active",
      communities: ["Indie Game Development"],
    },
    requestedBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-21T11:45:00Z"),
    newRole: "moderator",
    communityName: "Indie Game Development",
    status: "pending",
  },
];

// Build post detail data from relational structure
function buildPostDetail(postId: string): PostDetailData | null {
  const post = mockPosts.find((p) => p.id === postId);
  if (!post) return null;

  const community = mockCommunities.find((c) => c.slug === post.communityId);

  // Build nested replies from flat mockReplies with proper user resolution
  function nestReplies(parentId: string | null): PostDetailReply[] {
    return mockReplies
      .filter(
        (r) => (r.parentReplyId || null) === parentId && r.postId === postId
      )
      .map((r) => {
        return {
          id: r.id,
          author: r.author,
          content: r.content,
          timestamp: r.createdAt,
          likes: r.likes,
          isLiked: false,
          replies: nestReplies(r.id),
        };
      });
  }

  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: post.author,
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
    communityName: community?.name || "Unknown Community",
  };
}

// --- Admin Analytics with proper structure ---
const mockAnalyticsCommunities = [
  {
    id: COMMUNITY_IDS.WEB_DEV,
    name: "Web Development",
    members: 2100,
    posts: 867,
    comments: 3200,
    growth_rate: 15.2,
    activity_score: 94.5,
  },
  {
    id: COMMUNITY_IDS.PHOTOGRAPHY,
    name: "Photography Enthusiasts",
    members: 1500,
    posts: 543,
    comments: 2100,
    growth_rate: 8.7,
    activity_score: 87.3,
  },
  {
    id: COMMUNITY_IDS.SUSTAINABLE,
    name: "Sustainable Living",
    members: 1456,
    posts: 321,
    comments: 900,
    growth_rate: 12.1,
    activity_score: 76.8,
  },
  {
    id: COMMUNITY_IDS.INDIE_GAME,
    name: "Indie Game Development",
    members: 987,
    posts: 210,
    comments: 600,
    growth_rate: 22.4,
    activity_score: 82.1,
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
  engagementRate: 68.5,
  retentionRate: 84.2,
};

const mockActivityData = [
  { date: "2024-06-01", posts: 10, comments: 40, users: 120 },
  { date: "2024-06-02", posts: 12, comments: 45, users: 135 },
  { date: "2024-06-03", posts: 8, comments: 38, users: 118 },
  { date: "2024-06-04", posts: 15, comments: 60, users: 142 },
  { date: "2024-06-05", posts: 20, comments: 80, users: 165 },
  { date: "2024-06-06", posts: 18, comments: 72, users: 158 },
  { date: "2024-06-07", posts: 22, comments: 88, users: 176 },
];

const mockSizeDistribution = [
  {
    name: "<100",
    value: 5,
    color: "#8884d8",
    communities: ["AI Artists", "Book Club", "Cooking Basics"],
  },
  {
    name: "100-500",
    value: 10,
    color: "#82ca9d",
    communities: ["Gaming Hub", "Travel Tips", "Art Showcase"],
  },
  {
    name: "500-1000",
    value: 6,
    color: "#ffc658",
    communities: ["Sustainable Living", "Indie Game Dev"],
  },
  {
    name: ">1000",
    value: 4,
    color: "#ff8042",
    communities: ["Web Development", "Photography Enthusiasts"],
  },
];

// --- Admin structured data ---
const mockAdminCommunities = [
  {
    id: COMMUNITY_IDS.WEB_DEV,
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    category: "Technology",
    status: "active",
    createdAt: new Date("2024-03-10T08:00:00Z"),
    moderators: [USER_IDS.REGULAR],
    tags: ["JavaScript", "React", "Node.js", "TypeScript", "Frontend"],
    createdBy: USER_IDS.REGULAR,
    requestedAt: new Date("2024-03-10T08:00:00Z"),
    lastActivity: new Date("2024-06-21T15:30:00Z"),
  },
  {
    id: COMMUNITY_IDS.PHOTOGRAPHY,
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    category: "Creative",
    status: "active",
    createdAt: new Date("2024-02-15T10:30:00Z"),
    moderators: [USER_IDS.MODERATOR],
    tags: ["Photography", "Camera", "Editing", "Portrait", "Landscape"],
    createdBy: USER_IDS.MODERATOR,
    requestedAt: new Date("2024-02-15T10:30:00Z"),
    lastActivity: new Date("2024-06-22T12:45:00Z"),
  },
  {
    id: COMMUNITY_IDS.SUSTAINABLE,
    name: "Sustainable Living",
    description: "Tips and discussions about eco-friendly lifestyle choices",
    memberCount: 1456,
    postCount: 321,
    category: "Lifestyle",
    status: "active",
    createdAt: new Date("2024-04-01T14:15:00Z"),
    moderators: [USER_IDS.USER_3],
    tags: ["Eco", "Green", "Sustainability", "Environment", "Climate"],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-04-01T14:15:00Z"),
    lastActivity: new Date("2024-06-23T09:20:00Z"),
  },
  {
    id: COMMUNITY_IDS.INDIE_GAME,
    name: "Indie Game Development",
    description:
      "For independent game developers to share experiences and resources",
    memberCount: 987,
    postCount: 210,
    category: "Gaming",
    status: "active",
    createdAt: new Date("2024-05-10T16:00:00Z"),
    moderators: [USER_IDS.REGULAR],
    tags: ["Games", "Indie", "Development", "Unity", "Godot"],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-05-10T16:00:00Z"),
    lastActivity: new Date("2024-06-24T18:10:00Z"),
  },
  {
    id: COMMUNITY_IDS.ECO_LIVING,
    name: "Eco Living",
    description:
      "A community for sharing tips and stories about sustainable living and environmental consciousness.",
    memberCount: 0,
    postCount: 0,
    category: "Lifestyle",
    status: "pending",
    createdAt: new Date("2024-06-25T14:20:00Z"),
    moderators: [USER_IDS.USER_3],
    tags: ["Eco", "Green", "Sustainability", "Environment"],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-25T14:20:00Z"),
    lastActivity: null,
  },
  {
    id: COMMUNITY_IDS.AI_ARTISTS,
    name: "AI Artists",
    description:
      "Exploring the intersection of art and artificial intelligence, showcasing AI-generated artwork and discussing tools.",
    memberCount: 0,
    postCount: 0,
    category: "Art",
    status: "pending",
    createdAt: new Date("2024-06-24T11:45:00Z"),
    moderators: [USER_IDS.USER_4],
    tags: ["AI", "Art", "Machine Learning", "Digital Art"],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-24T11:45:00Z"),
    lastActivity: null,
  },
];

// --- Admin Users with database-like structure ---
const mockAdminUsers = [
  {
    id: USER_IDS.REGULAR,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    status: "active",
    joinDate: new Date("2024-02-20T14:30:00Z"),
    isActive: true,
    lastLogin: new Date("2024-06-25T10:30:00Z"),
    communities: ["Web Development", "Photography Enthusiasts"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    isEmailVerified: true,
    loginCount: 45,
    postCount: 12,
    commentCount: 67,
  },
  {
    id: USER_IDS.MODERATOR,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "moderator",
    status: "active",
    joinDate: new Date("2024-01-25T11:20:00Z"),
    isActive: true,
    lastLogin: new Date("2024-06-24T09:00:00Z"),
    communities: ["Photography Enthusiasts"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    isEmailVerified: true,
    loginCount: 78,
    postCount: 23,
    commentCount: 134,
  },
  {
    id: USER_IDS.ADMIN,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    joinDate: new Date("2024-01-15T10:00:00Z"),
    isActive: true,
    lastLogin: new Date("2024-06-23T14:15:00Z"),
    communities: ["Web Development"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    isEmailVerified: true,
    loginCount: 156,
    postCount: 8,
    commentCount: 89,
  },
];

const mockPendingAdminRoleChanges = [
  {
    id: generateUUID("rolechange-john-moderator"),
    user: {
      id: USER_IDS.REGULAR,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
    },
    requestedBy: USER_IDS.ADMIN,
    requestedAt: new Date("2024-06-25T09:30:00Z"),
    newRole: "moderator",
    status: "pending",
    reason:
      "Active contributor and helpful in discussions. Consistently provides quality content and assists other users.",
  },
  {
    id: generateUUID("rolechange-alice-admin"),
    user: {
      id: USER_IDS.MODERATOR,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "moderator",
    },
    requestedBy: USER_IDS.ADMIN,
    requestedAt: new Date("2024-06-24T16:20:00Z"),
    newRole: "admin",
    status: "pending",
    reason:
      "Consistently moderates communities effectively and manages user issues with professionalism.",
  },
];

// --- Admin Reports with proper relational structure ---
const mockAdminReports = [
  {
    id: generateUUID("admin-report-spam"),
    status: "pending",
    contentType: "post",
    contentId: POST_IDS.POST_1,
    reason: "Spam content with undisclosed affiliate links",
    createdAt: new Date("2024-06-20T10:30:00Z").toISOString(),
    reportedBy: USER_IDS.REGULAR,
    contentPreview: "Check out this amazing new framework...",
    originalContent: {
      title: "The Future of Web Development",
      community: "Web Development",
      author: "John Doe",
      fullText:
        "Check out this amazing new framework that will revolutionize web development! [Contains undisclosed affiliate links and promotional content]",
      postId: POST_IDS.POST_1,
      communityId: COMMUNITY_IDS.WEB_DEV,
    },
  },
  {
    id: generateUUID("admin-report-harassment"),
    status: "pending",
    contentType: "reply",
    contentId: generateUUID("reply-harassment"),
    reason: "Abusive language and personal attacks",
    createdAt: new Date("2024-06-19T14:20:00Z").toISOString(),
    reportedBy: USER_IDS.MODERATOR,
    contentPreview: "Your photos are terrible and you should...",
    originalContent: {
      parentPost: "Best Photography Spots in the City",
      author: "Anonymous User",
      fullText:
        "Your photos are terrible and you should stop posting here. You have no talent and are wasting everyone's time.",
      postId: POST_IDS.POST_2,
      communityId: COMMUNITY_IDS.PHOTOGRAPHY,
    },
  },
  {
    id: generateUUID("admin-report-impersonation"),
    status: "pending",
    contentType: "user",
    contentId: generateUUID("fake-user-profile"),
    reason: "Impersonation of well-known photographer",
    createdAt: new Date("2024-06-18T11:45:00Z").toISOString(),
    reportedBy: USER_IDS.MODERATOR,
    contentPreview: "This user is pretending to be Ansel Adams...",
    originalContent: {
      name: "Ansel Adams Official",
      email: "fake.ansel@notreal.com",
      joined: "2024-06-01",
      bio: "Famous landscape photographer. All my original works available here!",
      fullText:
        "User profile: Ansel Adams Official (fake.ansel@notreal.com) - Claims to be the famous deceased photographer Ansel Adams",
      userId: generateUUID("fake-user-profile"),
    },
  },
];

// Helper function to get original content for reports with proper database lookup
function getOriginalContentForReport(report: Report): string | null {
  if (report.type === "post" && report.postId) {
    const post = mockPosts.find((p) => p.id === report.postId);
    const author = post ? mockUsers.find((u) => u.id === post.author) : null;
    return post
      ? `${post.title}\n\nAuthor: ${author?.name || "Unknown"}\n\n${
          post.content
        }`
      : null;
  }
  if (report.type === "reply" && report.replyId) {
    const reply = mockReplies.find((r) => r.id === report.replyId);
    const author = reply ? mockUsers.find((u) => u.id === reply.author) : null;
    return reply
      ? `Reply by ${author?.name || "Unknown"}:\n\n${reply.content}`
      : null;
  }
  if (report.type === "user" && report.userId) {
    const user = mockUsers.find((u) => u.id === report.userId);
    return user
      ? `User: ${user.name} (${user.email})\nBio: ${
          user.bio || "No bio"
        }\nJoined: ${user.createdAt.toLocaleDateString()}`
      : null;
  }
  return null;
}

// API functions - updated to work with new UUID structure
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
        id: generateUUID(`post-${Date.now()}`),
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

  async getCommunity(slug: string): Promise<Community | null> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(mockCommunities.find((c) => c.slug === slug) || null),
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
        id: generateUUID(`reply-${Date.now()}`),
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
        id: generateUUID(`conn-${Date.now()}`),
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
        id: generateUUID(`msg-${Date.now()}`),
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
  async getCommunityDetail(slug: string) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityDetails[slug] || null), 300)
    );
  },
  async getCommunityPosts(slug: string) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCommunityPosts[slug] || []), 300)
    );
  },

  async submitReport(reportData: any) {
    const newReport = {
      id: generateUUID(`report-${Date.now()}`),
      ...reportData,
      status: "pending",
      createdAt: new Date(),
    };
    return new Promise((resolve) => setTimeout(() => resolve(newReport), 300));
  },
};

// New function to get flagged reports for a community
export function getMockFlaggedReports(communityId: string) {
  return mockReports.filter(
    (r) => r.communityId === communityId && r.status === "pending"
  );
}

// --- Community Detail Mocks with proper UUIDs ---
const mockCommunityDetails: Record<string, any> = {
  "web-development": {
    slug: "web-development",
    name: "Web Development",
    description:
      "Discussion about modern web development practices and technologies",
    memberCount: 2100,
    postCount: 867,
    tags: ["JavaScript", "React", "Node.js", "TypeScript", "Frontend"],
    isMember: true,
    isModerator: false,
    moderators: [
      {
        id: USER_IDS.REGULAR,
        name: "John Doe",
        role: "moderator",
        joinedAsModAt: new Date("2024-03-10T08:00:00Z"),
      },
    ],
    rules: [
      "Be respectful",
      "Stay on topic",
      "No spam",
      "Use proper tags",
      "Help others learn",
    ],
    category: "Technology",
    isJoined: true,
    lastActivity: new Date("2024-06-21T15:30:00Z"),
    createdBy: USER_IDS.REGULAR,
    requestedAt: new Date("2024-03-10T08:00:00Z"),
    status: "active",
  },
  "photography-enthusiasts": {
    slug: "photography-enthusiasts",
    name: "Photography Enthusiasts",
    description:
      "Share your photography tips, gear reviews, and stunning shots",
    memberCount: 1500,
    postCount: 543,
    tags: ["Photography", "Camera", "Editing", "Portrait", "Landscape"],
    isMember: false,
    isModerator: true,
    moderators: [
      {
        id: USER_IDS.MODERATOR,
        name: "Alice Johnson",
        role: "moderator",
        joinedAsModAt: new Date("2024-02-15T10:30:00Z"),
      },
    ],
    rules: [
      "Share original work only",
      "Give constructive feedback",
      "No self-promotion without approval",
      "Credit other photographers",
      "Be supportive of beginners",
    ],
    category: "Creative",
    isJoined: true,
    lastActivity: new Date("2024-06-22T12:45:00Z"),
    createdBy: USER_IDS.MODERATOR,
    requestedAt: new Date("2024-02-15T10:30:00Z"),
    status: "active",
  },
  "sustainable-living": {
    slug: "sustainable-living",
    name: "Sustainable Living",
    description: "Tips and discussions about eco-friendly lifestyle choices",
    memberCount: 1456,
    postCount: 321,
    tags: ["Eco", "Green", "Sustainability", "Environment", "Climate"],
    isMember: false,
    isModerator: true,
    moderators: [
      {
        id: USER_IDS.USER_3,
        name: "Bob Smith",
        role: "moderator",
        joinedAsModAt: new Date("2024-04-01T14:15:00Z"),
      },
    ],
    rules: [
      "Be respectful",
      "Stay on topic",
      "No spam",
      "Use proper tags",
      "Help others learn",
    ],
    category: "Lifestyle",
    isJoined: false,
    lastActivity: new Date("2024-06-23T09:20:00Z"),
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-04-01T14:15:00Z"),
    status: "active",
  },
  "indie-game-dev": {
    slug: "indie-game-dev",
    name: "Indie Game Development",
    description:
      "For independent game developers to share experiences and resources",
    memberCount: 987,
    postCount: 210,
    tags: ["Games", "Indie", "Development", "Unity", "Godot"],
    isMember: false,
    isModerator: true,
    moderators: [
      {
        id: USER_IDS.REGULAR,
        name: "John Doe",
        role: "moderator",
        joinedAsModAt: new Date("2024-05-10T16:00:00Z"),
      },
    ],
    rules: [
      "Be respectful",
      "Stay on topic",
      "No spam",
      "Use proper tags",
      "Help others learn",
    ],
    category: "Gaming",
    isJoined: false,
    lastActivity: new Date("2024-06-24T18:10:00Z"),
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-05-10T16:00:00Z"),
    status: "active",
  },
  "tech-innovators": {
    slug: "tech-innovators",
    name: "Tech Innovators",
    description: "Discussing the latest in technology and innovation",
    memberCount: 890,
    postCount: 0,
    tags: ["Technology", "Innovation", "Startups"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Technology",
    isJoined: false,
    lastActivity: new Date("2024-06-20T10:00:00Z"),
    createdBy: USER_IDS.REGULAR,
    requestedAt: new Date("2024-06-20T10:00:00Z"),
    status: "active",
  },
  "cooking-adventures": {
    slug: "cooking-adventures",
    name: "Cooking Adventures",
    description: "Share recipes, cooking tips, and culinary experiences",
    memberCount: 2100,
    postCount: 0,
    tags: ["Cooking", "Recipes", "Food"],
    isMember: true,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Lifestyle",
    isJoined: true,
    lastActivity: new Date("2024-06-19T09:00:00Z"),
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-19T09:00:00Z"),
    status: "active",
  },
  "travel-stories": {
    slug: "travel-stories",
    name: "Travel Stories",
    description: "Share your travel experiences and get recommendations",
    memberCount: 756,
    postCount: 0,
    tags: ["Travel", "Adventure", "Culture"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Lifestyle",
    isJoined: false,
    lastActivity: new Date("2024-06-18T08:00:00Z"),
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-18T08:00:00Z"),
    status: "active",
  },
  "fitness-health": {
    slug: "fitness-health",
    name: "Fitness & Health",
    description: "Tips, motivation, and discussions about fitness and health",
    memberCount: 1543,
    postCount: 0,
    tags: ["Fitness", "Health", "Wellness"],
    isMember: true,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Lifestyle",
    isJoined: true,
    lastActivity: new Date("2024-06-17T07:00:00Z"),
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-17T07:00:00Z"),
    status: "active",
  },
  "book-club": {
    slug: "book-club",
    name: "Book Club",
    description: "Monthly book discussions and reading recommendations",
    memberCount: 432,
    postCount: 0,
    tags: ["Books", "Reading", "Literature"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Literature",
    isJoined: false,
    lastActivity: new Date("2024-06-16T06:00:00Z"),
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-16T06:00:00Z"),
    status: "active",
  },
  "gaming-hub": {
    slug: "gaming-hub",
    name: "Gaming Hub",
    description: "Discuss games, share gameplay, and find gaming partners",
    memberCount: 2890,
    postCount: 0,
    tags: ["Gaming", "Entertainment", "Community"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Gaming",
    isJoined: false,
    lastActivity: new Date("2024-06-15T05:00:00Z"),
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-15T05:00:00Z"),
    status: "active",
  },
  "art-design": {
    slug: "art-design",
    name: "Art & Design",
    description: "Showcase artwork and discuss design principles",
    memberCount: 1120,
    postCount: 0,
    tags: ["Art", "Design", "Creative"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Creative",
    isJoined: false,
    lastActivity: new Date("2024-06-14T04:00:00Z"),
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-14T04:00:00Z"),
    status: "active",
  },
  "music-makers": {
    slug: "music-makers",
    name: "Music Makers",
    description:
      "A community for musicians and music lovers to collaborate and share.",
    memberCount: 980,
    postCount: 0,
    tags: ["Music", "Collaboration", "Instruments"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Music",
    isJoined: false,
    lastActivity: new Date("2024-06-13T03:00:00Z"),
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-13T03:00:00Z"),
    status: "active",
  },
  "parenting-support": {
    slug: "parenting-support",
    name: "Parenting Support",
    description: "Advice and support for parents at every stage.",
    memberCount: 760,
    postCount: 0,
    tags: ["Parenting", "Family", "Support"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Family",
    isJoined: false,
    lastActivity: new Date("2024-06-12T02:00:00Z"),
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-12T02:00:00Z"),
    status: "active",
  },
  "entrepreneurs-united": {
    slug: "entrepreneurs-united",
    name: "Entrepreneurs United",
    description: "Connect with fellow entrepreneurs and share business tips.",
    memberCount: 2105,
    postCount: 0,
    tags: ["Business", "Entrepreneurship", "Startups"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Business",
    isJoined: false,
    lastActivity: new Date("2024-06-11T01:00:00Z"),
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-11T01:00:00Z"),
    status: "active",
  },
  "pet-lovers": {
    slug: "pet-lovers",
    name: "Pet Lovers",
    description: "Share stories, tips, and photos of your pets.",
    memberCount: 1580,
    postCount: 0,
    tags: ["Pets", "Animals", "Care"],
    isMember: false,
    isModerator: false,
    moderators: [],
    rules: [],
    category: "Lifestyle",
    isJoined: false,
    lastActivity: new Date("2024-06-10T00:00:00Z"),
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-10T00:00:00Z"),
    status: "active",
  },
  "language-exchange": {
    slug: "language-exchange",
    name: "Language Exchange",
    description: "Practice and learn new languages with others.",
    memberCount: 1200,
    postCount: 0,
    tags: ["Languages", "Learning", "Exchange"],
    isJoined: false,
    lastActivity: new Date("2024-06-09T23:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-09T23:00:00Z"),
  },
  "film-buffs": {
    slug: "film-buffs",
    name: "Film Buffs",
    description: "Discuss movies, directors, and the art of filmmaking.",
    memberCount: 890,
    postCount: 0,
    tags: ["Movies", "Film", "Discussion"],
    isJoined: false,
    lastActivity: new Date("2024-06-08T22:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-08T22:00:00Z"),
  },
  "science-explorers": {
    slug: "science-explorers",
    name: "Science Explorers",
    description: "Explore the wonders of science and discovery.",
    memberCount: 1010,
    postCount: 0,
    tags: ["Science", "Discovery", "Learning"],
    isJoined: false,
    lastActivity: new Date("2024-06-07T21:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-07T21:00:00Z"),
  },
  "mindfulness-meditation": {
    slug: "mindfulness-meditation",
    name: "Mindfulness & Meditation",
    description: "Share mindfulness practices and meditation tips.",
    memberCount: 670,
    postCount: 0,
    tags: ["Mindfulness", "Meditation", "Wellness"],
    isJoined: false,
    lastActivity: new Date("2024-06-06T20:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-06T20:00:00Z"),
  },
  "home-gardeners": {
    slug: "home-gardeners",
    name: "Home Gardeners",
    description: "Tips and inspiration for home gardening enthusiasts.",
    memberCount: 940,
    postCount: 0,
    tags: ["Gardening", "Plants", "Home"],
    isJoined: false,
    lastActivity: new Date("2024-06-05T19:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_5,
    requestedAt: new Date("2024-06-05T19:00:00Z"),
  },
  "cycling-community": {
    slug: "cycling-community",
    name: "Cycling Community",
    description: "Connect with cyclists and share your rides.",
    memberCount: 800,
    postCount: 0,
    tags: ["Cycling", "Fitness", "Outdoors"],
    isJoined: false,
    lastActivity: new Date("2024-06-04T18:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_3,
    requestedAt: new Date("2024-06-04T18:00:00Z"),
  },
  "board-game-society": {
    slug: "board-game-society",
    name: "Board Game Society",
    description: "Discuss and play board games with others.",
    memberCount: 540,
    postCount: 0,
    tags: ["Board Games", "Fun", "Strategy"],
    isJoined: false,
    lastActivity: new Date("2024-06-03T17:00:00Z"),
    status: "active",
    moderators: [],
    createdBy: USER_IDS.USER_4,
    requestedAt: new Date("2024-06-03T17:00:00Z"),
  },
};

// --- Admin Roles with proper UUID structure ---
const mockAdminRoles = [
  {
    id: generateUUID("role-admin"),
    name: "Admin",
    permissions: [
      "manage_users",
      "manage_communities",
      "manage_roles",
      "view_reports",
      "edit_settings",
      "access_analytics",
      "manage_system",
    ],
    description:
      "Full access to all admin features. Can manage users, communities, roles, and system settings.",
    icon: "admin",
    color: "bg-yellow-500",
    userCount: 1,
    users: [
      {
        id: USER_IDS.ADMIN,
        name: "Admin User",
        email: "admin@example.com",
        joinDate: new Date("2024-01-15T10:00:00Z"),
        communities: ["Web Development"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    ],
  },
  {
    id: generateUUID("role-moderator"),
    name: "Moderator",
    permissions: ["manage_communities", "view_reports", "moderate_content"],
    description:
      "Can moderate communities and view reports, but cannot manage users or system roles.",
    icon: "moderator",
    color: "bg-blue-500",
    userCount: 1,
    users: [
      {
        id: USER_IDS.MODERATOR,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        joinDate: new Date("2024-01-25T11:20:00Z"),
        communities: ["Photography Enthusiasts"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      },
    ],
  },
  {
    id: generateUUID("role-user"),
    name: "User",
    permissions: ["post_content", "comment", "join_communities"],
    description:
      "Can post content, comment, and participate in community discussions.",
    icon: "user",
    color: "bg-green-500",
    userCount: 1,
    users: [
      {
        id: USER_IDS.REGULAR,
        name: "John Doe",
        email: "john.doe@example.com",
        joinDate: new Date("2024-02-20T14:30:00Z"),
        communities: ["Web Development", "Photography Enthusiasts"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      },
    ],
  },
];
