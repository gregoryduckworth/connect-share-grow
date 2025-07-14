
import { z } from 'zod';

export const roleChangeSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  newRole: z.enum(['admin', 'moderator', 'user'], {
    required_error: 'Role is required',
  }),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export const reportActionSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  action: z.enum(['resolve', 'unresolve', 'dismiss'], {
    required_error: 'Action is required',
  }),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  moderatorNotes: z.string().optional(),
});

export const communityModerationSchema = z.object({
  communityId: z.string().min(1, 'Community ID is required'),
  action: z.enum(['approve', 'reject', 'suspend', 'activate'], {
    required_error: 'Action is required',
  }),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

export type RoleChangeData = z.infer<typeof roleChangeSchema>;
export type ReportActionData = z.infer<typeof reportActionSchema>;
export type CommunityModerationData = z.infer<typeof communityModerationSchema>;
