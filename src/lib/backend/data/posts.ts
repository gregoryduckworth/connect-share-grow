
import { Post } from "@/lib/types";

export const POSTS_DATA: Post[] = [
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
