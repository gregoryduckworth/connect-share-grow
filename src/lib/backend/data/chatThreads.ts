// Chat thread (conversation) entity for mock backend
export interface ChatThread {
  id: string;
  name?: string; // For group chats
  participantIds: string[]; // userIds
  isGroup: boolean;
  createdAt: Date;
}

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'b1a2c3d4-e5f6-7890-1234-567890abcdef', // thread-1
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T08:59:00Z'),
  },
  {
    id: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg', // thread-2
    name: 'Project Team',
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    ],
    isGroup: true,
    createdAt: new Date('2025-07-10T09:04:00Z'),
  },
  {
    id: 'd3c4e5f6-g7h8-9012-3456-789012cdefgh', // thread-3
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T09:10:00Z'),
  },
  {
    id: 'e4d5f6g7-h8i9-0123-4567-890123defghi', // thread-4
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T09:12:00Z'),
  },
  {
    id: 'f5e6g7h8-i9j0-1234-5678-901234efghij', // thread-5
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000002',
      'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T09:14:00Z'),
  },
  {
    id: 'g6f7h8i9-j1k2-3456-7890-abcdef123456', // thread-6
    name: undefined,
    participantIds: [
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T09:16:00Z'),
  },
  {
    id: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567', // thread-7
    name: 'All Hands',
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
      'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
      'd4e5f6g7-h8i9-0123-4567-890123defghi',
      'e5f6g7h8-i9j0-1234-5678-901234efghij',
      'f7g8h9i0-j1k2-3456-7890-abcdef123456',
      'g8h9i0j1-k2l3-4567-8901-bcdef1234567',
      'h9i0j1k2-l3m4-5678-9012-cdef12345678',
      'i0j1k2l3-m4n5-6789-0123-def123456789',
    ],
    isGroup: true,
    createdAt: new Date('2025-07-10T09:20:00Z'),
  },
  {
    id: 'c8f2b3d4-5e6f-4a7b-9c8d-2e3f4a5b6c7d',
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000001', // Demo Admin
      '00000000-0000-0000-0000-000000000002', // Demo User
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T09:59:00Z'),
  },
  {
    id: 'f2a3b4c5-6d7e-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Admin Announcements',
    participantIds: [
      '00000000-0000-0000-0000-000000000001',
      '00000000-0000-0000-0000-000000000002',
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    ],
    isGroup: true,
    createdAt: new Date('2025-07-10T10:04:00Z'),
  },
  {
    id: 'b3c4d5e6-9f0a-4b1c-8d2e-3f4a5b6c7d8e',
    name: undefined,
    participantIds: [
      '00000000-0000-0000-0000-000000000001', // Demo Admin
      'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Alex Johnson
    ],
    isGroup: false,
    createdAt: new Date('2025-07-10T10:09:00Z'),
  },
];
