// User-Community membership join table mock
// This models a many-to-many relationship as in a real database

export interface UserCommunityMembership {
  userId: string;
  communitySlug: string;
  role: 'member' | 'moderator';
  joinedAt: Date;
}

export const USER_COMMUNITY_MEMBERSHIPS: UserCommunityMembership[] = [
  // Demo Admin is a member and moderator of two communities
  {
    userId: 'demo-admin-0001',
    communitySlug: 'photography-enthusiasts',
    role: 'moderator',
    joinedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    userId: 'demo-admin-0001',
    communitySlug: 'tech-discussions',
    role: 'member',
    joinedAt: new Date('2024-01-01T00:00:00Z'),
  },

  // Demo User is a member of one community
  {
    userId: '00000000-0000-0000-0000-000000000001',
    communitySlug: 'photography-enthusiasts',
    role: 'member',
    joinedAt: new Date('2024-01-01T00:00:00Z'),
  },

  // Alex Johnson is a member of photography-enthusiasts
  {
    userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    communitySlug: 'photography-enthusiasts',
    role: 'member',
    joinedAt: new Date('2024-01-15T10:30:00Z'),
  },

  // Sarah Chen is a moderator of tech-discussions
  {
    userId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    communitySlug: 'tech-discussions',
    role: 'moderator',
    joinedAt: new Date('2024-01-10T14:20:00Z'),
  },

  // Mike Rodriguez is a member of fitness-wellness
  {
    userId: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
    communitySlug: 'fitness-wellness',
    role: 'member',
    joinedAt: new Date('2024-01-20T09:15:00Z'),
  },

  // Emma Wilson is a moderator of entrepreneurs-united
  {
    userId: 'd4e5f6g7-h8i9-0123-4567-890123defghi',
    communitySlug: 'entrepreneurs-united',
    role: 'moderator',
    joinedAt: new Date('2024-01-05T16:45:00Z'),
  },

  // David Kim is a member of two communities
  {
    userId: 'e5f6g7h8-i9j0-1234-5678-901234efghij',
    communitySlug: 'photography-enthusiasts',
    role: 'member',
    joinedAt: new Date('2024-01-12T11:30:00Z'),
  },
  {
    userId: 'e5f6g7h8-i9j0-1234-5678-901234efghij',
    communitySlug: 'fitness-wellness',
    role: 'member',
    joinedAt: new Date('2024-01-12T11:30:00Z'),
  },

  // Priya Patel is a member of fitness-wellness
  {
    userId: 'f7g8h9i0-j1k2-3456-7890-abcdef123456',
    communitySlug: 'fitness-wellness',
    role: 'member',
    joinedAt: new Date('2024-02-01T08:00:00Z'),
  },

  // Liam O'Brien is a member of two communities
  {
    userId: 'g8h9i0j1-k2l3-4567-8901-bcdef1234567',
    communitySlug: 'fitness-wellness',
    role: 'member',
    joinedAt: new Date('2024-02-10T13:00:00Z'),
  },
  {
    userId: 'g8h9i0j1-k2l3-4567-8901-bcdef1234567',
    communitySlug: 'entrepreneurs-united',
    role: 'member',
    joinedAt: new Date('2024-02-10T13:00:00Z'),
  },

  // Sofia Rossi is a member of photography-enthusiasts
  {
    userId: 'h9i0j1k2-l3m4-5678-9012-cdef12345678',
    communitySlug: 'photography-enthusiasts',
    role: 'member',
    joinedAt: new Date('2024-02-15T11:00:00Z'),
  },

  // Lucas Müller is a member of entrepreneurs-united
  {
    userId: 'i0j1k2l3-m4n5-6789-0123-def123456789',
    communitySlug: 'entrepreneurs-united',
    role: 'member',
    joinedAt: new Date('2024-02-20T15:00:00Z'),
  },
];
