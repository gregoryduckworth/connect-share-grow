// User-to-user relationship entity for mock backend
export type RelationshipStatus = 'friend' | 'pending' | 'blocked';

export interface UserRelationship {
  id: string;
  userId1: string;
  userId2: string;
  status: RelationshipStatus;
  createdAt: Date;
}

export const USER_RELATIONSHIPS: UserRelationship[] = [
  {
    id: 'rel-1',
    userId1: '00000000-0000-0000-0000-000000000001',
    userId2: '00000000-0000-0000-0000-000000000002',
    status: 'friend',
    createdAt: new Date('2025-07-01T10:00:00Z'),
  },
  {
    id: 'rel-2',
    userId1: '00000000-0000-0000-0000-000000000001',
    userId2: '00000000-0000-0000-0000-000000000003',
    status: 'pending',
    createdAt: new Date('2025-07-05T12:00:00Z'),
  },
  {
    id: 'rel-3',
    userId1: '00000000-0000-0000-0000-000000000002',
    userId2: '00000000-0000-0000-0000-000000000003',
    status: 'blocked',
    createdAt: new Date('2025-07-07T15:00:00Z'),
  },
];
