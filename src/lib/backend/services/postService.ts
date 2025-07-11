import { POSTS_DATA } from '../data/posts';
import { REPLIES_DATA } from '../data/replies';
import { USERS_DATA } from '../data/users';
import { COMMUNITIES_DATA } from '../data/communities';
import { USER_POST_LIKES, UserPostLike } from '../data/userPostLikes';
import type { Post, PostDetailData, PostDetailReply, CommunityPost } from '@/lib/types';

const getUserNameById = (userId: string): string => {
  const user = USERS_DATA.find((u) => u.id === userId);
  return user ? user.name : userId;
};

const getCommunityNameBySlug = (slug: string): string => {
  const community = COMMUNITIES_DATA.find((c) => c.slug === slug);
  return community ? community.name : 'Unknown Community';
};

export const postService = {
  getPosts: async (userId?: string): Promise<Post[]> => {
    return POSTS_DATA.map((post) => {
      const likeCount = USER_POST_LIKES.filter((l) => l.postId === post.id).length;
      const isLiked = userId
        ? USER_POST_LIKES.some((l) => l.postId === post.id && l.userId === userId)
        : false;
      return {
        ...post,
        author: getUserNameById(post.author),
        likes: likeCount,
        isLiked,
      };
    });
  },

  getPostDetail: async (postId: string, userId?: string): Promise<PostDetailData | undefined> => {
    const post = POSTS_DATA.find((post) => post.id === postId);
    if (!post) return undefined;
    const likeCount = USER_POST_LIKES.filter((l) => l.postId === post.id).length;
    const isLiked = userId
      ? USER_POST_LIKES.some((l) => l.postId === post.id && l.userId === userId)
      : false;
    const replies: PostDetailReply[] = REPLIES_DATA.filter((reply) => reply.postId === postId).map(
      (reply) => ({
        id: reply.id,
        author: reply.author,
        content: reply.content,
        timestamp: reply.createdAt,
        likes: reply.likes,
        isLiked: false,
        replies: [],
      }),
    );
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      timestamp: post.createdAt,
      likes: likeCount,
      comments: replies.length,
      isLiked,
      isPinned: false,
      isLocked: false,
      commentsLocked: false,
      tags: [],
      replies: replies,
      communityId: post.communityId,
      communityName: getCommunityNameBySlug(post.communityId),
    };
  },

  getPostLikes: async (postId: string): Promise<UserPostLike[]> => {
    return USER_POST_LIKES.filter((l) => l.postId === postId);
  },

  getUserLikedPosts: async (userId: string): Promise<string[]> => {
    return USER_POST_LIKES.filter((l) => l.userId === userId).map((l) => l.postId);
  },

  likePost: async (userId: string, postId: string): Promise<void> => {
    if (!USER_POST_LIKES.some((l) => l.userId === userId && l.postId === postId)) {
      USER_POST_LIKES.push({ userId, postId, likedAt: new Date() });
    }
  },

  unlikePost: async (userId: string, postId: string): Promise<void> => {
    const idx = USER_POST_LIKES.findIndex((l) => l.userId === userId && l.postId === postId);
    if (idx !== -1) {
      USER_POST_LIKES.splice(idx, 1);
    }
  },

  getHotPosts: async (): Promise<Post[]> => {
    return POSTS_DATA.filter((post) => post.isHot).map((post) => ({
      ...post,
      author: post.author,
      communityName: getCommunityNameBySlug(post.communityId),
    }));
  },

  getCommunityPosts: async (communitySlug: string): Promise<CommunityPost[]> => {
    return POSTS_DATA.filter((post) => post.communityId === communitySlug).map((post) => ({
      id: post.id,
      name: getCommunityNameBySlug(post.communityId),
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
    }));
  },

  createPost: async (
    communitySlug: string,
    postData: {
      title: string;
      content: string;
      tags?: string[];
    },
  ): Promise<Post> => {
    const newPost: Post = {
      id: `p${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: postData.title,
      content: postData.content,
      author: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      communityId: communitySlug,
      createdAt: new Date(),
      likes: 0,
      replies: 0,
      isLiked: false,
    };

    POSTS_DATA.push(newPost);
    return newPost;
  },
};
