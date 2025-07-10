// User-Post Like join table
export interface UserPostLike {
  userId: string;
  postId: string;
  likedAt: Date;
}

export const USER_POST_LIKES: UserPostLike[] = [
  {
    userId: '00000000-0000-0000-0000-000000000001',
    postId: 'p1a2b3c4-d5e6-f789-0123-456789abcdef',
    likedAt: new Date('2024-01-25T15:00:00Z'),
  },
  {
    userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    postId: 'p1a2b3c4-d5e6-f789-0123-456789abcdef',
    likedAt: new Date('2024-01-25T15:10:00Z'),
  },
  {
    userId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    postId: 'p2b3c4d5-e6f7-g890-1234-567890bcdefg',
    likedAt: new Date('2024-01-24T17:00:00Z'),
  },
  {
    userId: 'demo-admin-0001',
    postId: 'p3c4d5e6-f7g8-h901-2345-678901cdefgh',
    likedAt: new Date('2024-01-23T13:00:00Z'),
  },
  {
    userId: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
    postId: 'p3c4d5e6-f7g8-h901-2345-678901cdefgh',
    likedAt: new Date('2024-01-23T13:10:00Z'),
  },
];
