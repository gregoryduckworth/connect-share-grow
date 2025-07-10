export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  postId?: string;
  communityId?: string;
}

export const NOTIFICATIONS_DATA: Notification[] = [
  {
    id: 'n1a2b3c4-d5e6-f789-0123-456789abcdef',
    type: 'reply',
    title: 'New reply to your post',
    message: 'David Kim replied to your post about camera settings',
    timestamp: new Date('2024-01-25T15:45:00Z'),
    postId: 'p1a2b3c4-d5e6-f789-0123-456789abcdef',
    communityId: 'photography-enthusiasts',
  },
  {
    id: 'n2b3c4d5-e6f7-g890-1234-567890bcdefg',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Emma Wilson mentioned you in Tech Discussions',
    timestamp: new Date('2024-01-24T17:30:00Z'),
    postId: 'p2b3c4d5-e6f7-g890-1234-567890bcdefg',
    communityId: 'tech-discussions',
  },
  {
    id: 'n3c4d5e6-f7g8-h901-2345-678901cdefgh',
    type: 'community_invite',
    title: 'Community Invitation',
    message: 'You have been invited to join Fitness & Wellness community.',
    timestamp: new Date('2024-01-23T12:00:00Z'),
    communityId: 'fitness-wellness',
  },
];
