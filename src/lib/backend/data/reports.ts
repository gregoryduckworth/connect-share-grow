import type { Report } from '@/lib/types';
import { USERS_DATA } from './users';
import { POSTS_DATA } from './posts';

export const REPORTS_DATA: Report[] = [
  {
    id: 'rep1a2b3-c4d5-e6f7-g890-123456789abc',
    reportedBy: USERS_DATA[0].id,
    contentType: 'post',
    contentId: POSTS_DATA[0].id,
    contentPreview: POSTS_DATA[0].title ?? '',
    content: POSTS_DATA[0].content ?? '',
    communityId: POSTS_DATA[0].communityId ?? '',
    reason: 'Inappropriate content',
    createdAt: new Date('2024-01-24T10:30:00Z'),
    status: 'pending',
  },
  {
    id: 'rep2b3c4-d5e6-f789-0123-456789abcdef',
    reportedBy: USERS_DATA[0].id,
    contentType: 'reply',
    contentId: 'r1a2b3c4-d5e6-f789-0123-456789abcdef',
    contentPreview: 'Reply preview here',
    content: 'Full reply content here',
    communityId: POSTS_DATA[0].communityId ?? '',
    reason: 'Spam reply',
    createdAt: new Date('2024-01-25T11:00:00Z'),
    status: 'reviewed',
  },
  {
    id: 'rep3c4d5-e6f7-g890-1234-567890bcdefg',
    reportedBy: USERS_DATA[2].id,
    contentType: 'user',
    contentId: USERS_DATA[1].id,
    contentPreview: USERS_DATA[1].name ?? '',
    content: USERS_DATA[1].bio ?? '',
    communityId: '',
    reason: 'Harassment',
    createdAt: new Date('2024-01-26T09:00:00Z'),
    status: 'pending',
  },
  {
    id: 'rep4d5e6-f7g8-h901-2345-678901cdefgh',
    reportedBy: USERS_DATA[3].id,
    contentType: 'post',
    contentId: 'fitness-wellness',
    contentPreview: 'Fitness & Wellness',
    content: 'Off-topic post content here',
    communityId: 'fitness-wellness',
    reason: 'Off-topic posts',
    status: 'resolved',
    createdAt: new Date('2024-01-27T14:00:00Z'),
  },
  {
    id: 'rep4d5e6-f7g8-h901-2345-678901cdefgh',
    reportedBy: USERS_DATA[3].id,
    contentType: 'post',
    contentId: 'fitness-wellness',
    reason: 'Off-topic posts',
    status: 'resolved',
    createdAt: new Date('2024-01-27T14:00:00Z'),
    communityId: 'fitness-wellness',
    contentPreview: 'Off-topic posts in Fitness & Wellness',
    content: 'Off-topic post content here',
  },
];
