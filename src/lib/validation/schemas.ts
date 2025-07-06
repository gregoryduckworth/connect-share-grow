
import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Post schemas
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type CreateCommunityFormData = z.infer<typeof createCommunitySchema>;
