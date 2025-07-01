
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users first
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "demo-admin-0001",
        name: "Demo Admin",
        email: "admin@example.com",
        role: "ADMIN",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Demo admin account for testing.",
        location: "Demo City",
      }
    }),
    prisma.user.create({
      data: {
        id: "demo-user-0001",
        name: "Demo User",
        email: "user@example.com",
        role: "USER",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Demo user account for testing.",
        location: "Demo Town",
      }
    }),
    prisma.user.create({
      data: {
        id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        role: "USER",
        createdAt: new Date("2024-01-15T10:30:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Photography enthusiast and nature lover",
        location: "San Francisco, CA",
      }
    }),
    prisma.user.create({
      data: {
        id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        role: "MODERATOR",
        createdAt: new Date("2024-01-10T14:20:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Tech enthusiast and community moderator",
        location: "New York, NY",
      }
    }),
    prisma.user.create({
      data: {
        id: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        name: "Mike Rodriguez",
        email: "mike.rodriguez@example.com",
        role: "USER",
        createdAt: new Date("2024-01-20T09:15:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Fitness trainer and wellness coach",
        location: "Austin, TX",
      }
    }),
    prisma.user.create({
      data: {
        id: "d4e5f6g7-h8i9-0123-4567-890123defghi",
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        role: "ADMIN",
        createdAt: new Date("2024-01-05T16:45:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Community administrator and developer",
        location: "Seattle, WA",
      }
    }),
    prisma.user.create({
      data: {
        id: "e5f6g7h8-i9j0-1234-5678-901234efghij",
        name: "David Kim",
        email: "david.kim@example.com",
        role: "USER",
        createdAt: new Date("2024-01-12T11:30:00Z"),
        isActive: true,
        isEmailVerified: true,
        isSuspended: false,
        language: "en",
        avatar: "",
        bio: "Travel blogger and photographer",
        location: "Los Angeles, CA",
      }
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create communities
  const communities = await Promise.all([
    prisma.community.create({
      data: {
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
        moderators: {
          connect: [{ id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg" }]
        }
      }
    }),
    prisma.community.create({
      data: {
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
        moderators: {
          connect: [
            { id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg" },
            { id: "d4e5f6g7-h8i9-0123-4567-890123defghi" }
          ]
        }
      }
    }),
    prisma.community.create({
      data: {
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
        moderators: {
          connect: [{ id: "c3d4e5f6-g7h8-9012-3456-789012cdefgh" }]
        }
      }
    }),
    prisma.community.create({
      data: {
        slug: "entrepreneurs-united",
        name: "Entrepreneurs United",
        description: "Connect with fellow entrepreneurs, share business insights, and grow your network.",
        memberCount: 1834,
        postCount: 167,
        category: "Business",
        tags: ["entrepreneurship", "business", "startups", "networking"],
        isJoined: false,
        lastActivity: new Date("2024-01-21T09:30:00Z"),
        createdBy: "e5f6g7h8-i9j0-1234-5678-901234efghij",
        status: "active",
        moderators: {
          connect: [{ id: "e5f6g7h8-i9j0-1234-5678-901234efghij" }]
        }
      }
    }),
  ]);

  console.log(`✅ Created ${communities.length} communities`);

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        id: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        title: "Best Camera Settings for Golden Hour Photography",
        content: "Golden hour provides the most beautiful natural lighting for photography. Here are my recommended camera settings: Use a wide aperture (f/1.4-f/2.8) for shallow depth of field, keep ISO low (100-400) to minimize noise, and adjust shutter speed based on your subject movement. Don't forget to shoot in RAW format for maximum editing flexibility!",
        authorId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        communityId: "photography-enthusiasts",
        createdAt: new Date("2024-01-25T14:30:00Z"),
        likes: 45,
        replies: 12,
        isLiked: true,
        isHot: true,
      }
    }),
    prisma.post.create({
      data: {
        id: "p6a7b8c9-d0e1-f234-5678-901234bcdefg",
        title: "How to Edit Photos Like a Pro",
        content: "Editing is just as important as taking the photo! What software do you use and what are your favorite editing tips for beginners?",
        authorId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        communityId: "photography-enthusiasts",
        createdAt: new Date("2024-01-20T10:00:00Z"),
        likes: 22,
        replies: 5,
        isLiked: false,
        isHot: false,
      }
    }),
    prisma.post.create({
      data: {
        id: "p7b8c9d0-e1f2-g345-6789-012345cdefgh",
        title: "Show Us Your Best Wildlife Shots!",
        content: "Let's have a thread for wildlife photography. Share your favorite animal photos and the story behind them!",
        authorId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
        communityId: "photography-enthusiasts",
        createdAt: new Date("2024-01-18T09:00:00Z"),
        likes: 31,
        replies: 7,
        isLiked: false,
        isHot: false,
      }
    }),
    prisma.post.create({
      data: {
        id: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
        title: "The Future of React Server Components",
        content: "React Server Components are revolutionizing how we think about server-side rendering and client-side interactivity. This new paradigm allows us to run components on the server, reducing bundle size and improving performance. Let's discuss the implications and best practices for implementing RSCs in production applications.",
        authorId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
        communityId: "tech-discussions",
        createdAt: new Date("2024-01-24T16:20:00Z"),
        likes: 67,
        replies: 18,
        isLiked: false,
        isHot: true,
      }
    }),
    prisma.post.create({
      data: {
        id: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
        title: "My 30-Day Fitness Transformation Journey",
        content: "I wanted to share my incredible 30-day fitness transformation journey with everyone. Through consistent daily workouts, proper nutrition planning, and staying motivated, I've seen amazing results. Here's my detailed workout routine, meal plans, and the mindset shifts that made all the difference.",
        authorId: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        communityId: "fitness-wellness",
        createdAt: new Date("2024-01-23T12:45:00Z"),
        likes: 23,
        replies: 8,
        isLiked: false,
      }
    }),
    prisma.post.create({
      data: {
        id: "p4d5e6f7-g8h9-i012-3456-789012defghi",
        title: "Building a Sustainable Startup Culture",
        content: "Creating a lasting company culture is one of the biggest challenges for entrepreneurs. After building three startups, I've learned that culture isn't something you can force - it grows organically from your values and actions. Here are the key principles that have helped me build strong, sustainable teams.",
        authorId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
        communityId: "entrepreneurs-united",
        createdAt: new Date("2024-01-22T18:15:00Z"),
        likes: 34,
        replies: 15,
        isLiked: true,
      }
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create replies
  const replies = await Promise.all([
    prisma.reply.create({
      data: {
        id: "r1a2b3c4-d5e6-f789-0123-456789abcdef",
        content: "Great tips! I've been struggling with golden hour shots. The wide aperture suggestion really helped my portraits pop.",
        authorId: "e5f6g7h8-i9j0-1234-5678-901234efghij",
        postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        createdAt: new Date("2024-01-25T15:45:00Z"),
        likes: 8,
        parentReplyId: null,
      }
    }),
    prisma.reply.create({
      data: {
        id: "r2b3c4d5-e6f7-g890-1234-567890bcdefg",
        content: "RSCs are game-changing! We've implemented them in our production app and saw a 40% reduction in bundle size.",
        authorId: "d4e5f6g7-h8i9-0123-4567-890123defghi",
        postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
        createdAt: new Date("2024-01-24T17:30:00Z"),
        likes: 12,
        parentReplyId: null,
      }
    }),
    prisma.reply.create({
      data: {
        id: "r3c4d5e6-f7g8-h901-2345-678901cdefgh",
        content: "Amazing transformation! What was your biggest challenge during the 30 days?",
        authorId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        postId: "p3c4d5e6-f7g8-h901-2345-678901cdefgh",
        createdAt: new Date("2024-01-23T14:20:00Z"),
        likes: 3,
        parentReplyId: null,
      }
    }),
  ]);

  console.log(`✅ Created ${replies.length} replies`);

  // Create notifications
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        id: "n1a2b3c4-d5e6-f789-0123-456789abcdef",
        type: "reply",
        title: "New reply to your post",
        message: "David Kim replied to your post about camera settings",
        timestamp: new Date("2024-01-25T15:45:00Z"),
        isRead: false,
        userId: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        communityId: "photography-enthusiasts",
      }
    }),
    prisma.notification.create({
      data: {
        id: "n2b3c4d5-e6f7-g890-1234-567890bcdefg",
        type: "mention",
        title: "You were mentioned",
        message: "Emma Wilson mentioned you in Tech Discussions",
        timestamp: new Date("2024-01-24T17:30:00Z"),
        isRead: false,
        userId: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
        postId: "p2b3c4d5-e6f7-g890-1234-567890bcdefg",
        communityId: "tech-discussions",
      }
    }),
  ]);

  console.log(`✅ Created ${notifications.length} notifications`);

  // Create reports
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        id: "rep1a2b3-c4d5-e6f7-g890-123456789abc",
        contentType: "post",
        contentId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        contentPreview: "This post contains inappropriate language and violates community guidelines.",
        reportedBy: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        createdAt: new Date("2024-01-24T10:30:00Z"),
        reason: "Inappropriate content",
        status: "pending",
        content: "This post contains inappropriate language and violates community guidelines.",
        postId: "p1a2b3c4-d5e6-f789-0123-456789abcdef",
        communityId: "photography-enthusiasts",
        originalLink: "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef",
      }
    }),
    prisma.report.create({
      data: {
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
        originalLink: "/community/photography-enthusiasts/post/p1a2b3c4-d5e6-f789-0123-456789abcdef#reply-r1a2b3c4-d5e6-f789-0123-456789abcdef",
      }
    }),
  ]);

  console.log(`✅ Created ${reports.length} reports`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
