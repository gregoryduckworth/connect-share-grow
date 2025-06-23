
// Mock API service - returns mock data for now
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  communityId: string;
  communityName: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isHot?: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  category: string;
  tags: string[];
  isJoined: boolean;
  lastActivity: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "moderator" | "admin";
  createdAt: Date;
  isActive: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: string;
  postId: string;
  createdAt: Date;
  likes: number;
}

// Mock data
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
    lastActivity: new Date(2024, 5, 21)
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
      const mockUsers: User[] = [
        {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          createdAt: new Date(2024, 4, 15),
          isActive: true
        }
      ];
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  // Notifications
  async markNotificationAsRead(notificationId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  }
};
