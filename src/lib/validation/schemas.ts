
// Re-export auth schemas for backward compatibility
export * from './authSchemas';

// Post schemas
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters long').max(5000, 'Content must be less than 5000 characters'),
  communityId: z.string().min(1, 'Community is required'),
});

// Community schemas
export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Community name must be at least 3 characters long').max(50, 'Community name must be less than 50 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(500, 'Description must be less than 500 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long').max(50, 'Slug must be less than 50 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type CreateCommunityFormData = z.infer<typeof createCommunitySchema>;
