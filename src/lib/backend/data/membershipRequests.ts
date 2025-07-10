// Community membership requests table
export interface MembershipRequest {
  userId: string;
  communitySlug: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  respondedAt?: Date;
}

export const MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  {
    userId: '00000000-0000-0000-0000-000000000001',
    communitySlug: 'tech-discussions',
    status: 'pending',
    requestedAt: new Date('2024-02-01T10:00:00Z'),
  },
  {
    userId: 'f7g8h9i0-j1k2-3456-7890-abcdef123456',
    communitySlug: 'entrepreneurs-united',
    status: 'approved',
    requestedAt: new Date('2024-02-02T09:00:00Z'),
    respondedAt: new Date('2024-02-03T12:00:00Z'),
  },
  {
    userId: 'g8h9i0j1-k2l3-4567-8901-bcdef1234567',
    communitySlug: 'fitness-wellness',
    status: 'denied',
    requestedAt: new Date('2024-02-04T11:00:00Z'),
    respondedAt: new Date('2024-02-05T08:00:00Z'),
  },
];
