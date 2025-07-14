
import { Community } from '@/lib/types';
import { USERS_DATA } from './users';

export const COMMUNITIES_DATA: Community[] = [
  {
    id: 'comm-photography-1',
    slug: 'photography-enthusiasts',
    name: 'Photography Enthusiasts',
    description:
      'A community for photographers of all skill levels to share tips, techniques, and showcase their work.',
    memberCount: 1247,
    postCount: 89,
    category: 'Creative Arts',
    tags: ['photography', 'art', 'creative', 'digital'],
    lastActivity: new Date('2024-01-25T14:30:00Z'),
    createdBy: USERS_DATA[0].id,
    status: 'active',
  },
  {
    id: 'comm-tech-2',
    slug: 'tech-discussions',
    name: 'Tech Discussions',
    description:
      'Discuss the latest trends in technology, programming languages, and software development.',
    memberCount: 2156,
    postCount: 234,
    category: 'Technology',
    tags: ['tech', 'programming', 'software', 'development'],
    lastActivity: new Date('2024-01-24T16:20:00Z'),
    createdBy: USERS_DATA[1].id,
    status: 'active',
  },
  {
    id: 'comm-fitness-3',
    slug: 'fitness-wellness',
    name: 'Fitness & Wellness',
    description:
      'Share workout routines, nutrition tips, and wellness advice for a healthier lifestyle.',
    memberCount: 892,
    postCount: 156,
    category: 'Health & Fitness',
    tags: ['fitness', 'health', 'wellness', 'nutrition'],
    lastActivity: new Date('2024-01-23T12:45:00Z'),
    createdBy: USERS_DATA[2].id,
    status: 'active',
  },
  {
    id: 'comm-business-4',
    slug: 'entrepreneurs-united',
    name: 'Entrepreneurs United',
    description:
      'Connect with fellow entrepreneurs, share business insights, and grow your network.',
    memberCount: 1834,
    postCount: 167,
    category: 'Business',
    tags: ['entrepreneurship', 'business', 'startups', 'networking'],
    lastActivity: new Date('2024-01-21T09:30:00Z'),
    createdBy: USERS_DATA[3].id,
    status: 'active',
  },
];
