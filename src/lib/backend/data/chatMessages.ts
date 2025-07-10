// Chat message entity for mock backend
export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readBy: string[]; // userIds who have read this message
}

export const CHAT_MESSAGES: ChatMessage[] = [
  // Thread 1: Demo Admin and Demo User
  {
    id: 'b1a2c3d4-0001-0000-0000-000000000001',
    threadId: 'b1a2c3d4-e5f6-7890-1234-567890abcdef',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Hey! How are you?',
    timestamp: new Date('2025-07-10T09:00:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'],
  },
  {
    id: 'b1a2c3d4-0002-0000-0000-000000000002',
    threadId: 'b1a2c3d4-e5f6-7890-1234-567890abcdef',
    senderId: '00000000-0000-0000-0000-000000000002', // Demo User
    content: 'I am good, thanks! How about you?',
    timestamp: new Date('2025-07-10T09:01:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'],
  },
  {
    id: 'b1a2c3d4-0003-0000-0000-000000000003',
    threadId: 'b1a2c3d4-e5f6-7890-1234-567890abcdef',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Doing well! Working on the new project.',
    timestamp: new Date('2025-07-10T09:02:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'b1a2c3d4-0004-0000-0000-000000000004',
    threadId: 'b1a2c3d4-e5f6-7890-1234-567890abcdef',
    senderId: '00000000-0000-0000-0000-000000000002', // Demo User
    content: 'Nice! Let me know if you need any help.',
    timestamp: new Date('2025-07-10T09:03:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000002'],
  },
  // Thread 2: Project Team group chat
  {
    id: 'c2b3d4e5-0001-0000-0000-000000000005',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Alex Johnson
    content: 'Welcome to the group chat!',
    timestamp: new Date('2025-07-10T09:05:00Z'),
    readBy: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  },
  {
    id: 'c2b3d4e5-0002-0000-0000-000000000006',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Thanks! Excited to work together.',
    timestamp: new Date('2025-07-10T09:06:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'c2b3d4e5-0003-0000-0000-000000000007',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: '00000000-0000-0000-0000-000000000002', // Demo User
    content: 'Let’s set up a call later today.',
    timestamp: new Date('2025-07-10T09:07:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000002'],
  },
  {
    id: 'c2b3d4e5-0004-0000-0000-000000000008',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Alex Johnson
    content: 'Sounds good! What time works for everyone?',
    timestamp: new Date('2025-07-10T09:08:00Z'),
    readBy: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  },
  {
    id: 'c2b3d4e5-0005-0000-0000-000000000009',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'I’m free after 2pm.',
    timestamp: new Date('2025-07-10T09:09:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'c2b3d4e5-0006-0000-0000-000000000010',
    threadId: 'c2b3d4e5-f6g7-8901-2345-678901bcdefg',
    senderId: '00000000-0000-0000-0000-000000000002', // Demo User
    content: 'Same here!',
    timestamp: new Date('2025-07-10T09:10:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000002'],
  },
  // Thread 3: Demo Admin and Sarah Chen
  {
    id: 'd3c4e5f6-0001-0000-0000-000000000011',
    threadId: 'd3c4e5f6-g7h8-9012-3456-789012cdefgh',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Hi Sarah, how are things in New York?',
    timestamp: new Date('2025-07-10T09:11:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'd3c4e5f6-0002-0000-0000-000000000012',
    threadId: 'd3c4e5f6-g7h8-9012-3456-789012cdefgh',
    senderId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg', // Sarah Chen
    content: 'Busy but good! How about you?',
    timestamp: new Date('2025-07-10T09:12:00Z'),
    readBy: ['b2c3d4e5-f6g7-8901-2345-678901bcdefg'],
  },
  // Thread 4: Demo Admin and Mike Rodriguez
  {
    id: 'e4d5f6g7-0001-0000-0000-000000000013',
    threadId: 'e4d5f6g7-h8i9-0123-4567-890123defghi',
    senderId: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh', // Mike Rodriguez
    content: 'Hey Demo, want to join my fitness class?',
    timestamp: new Date('2025-07-10T09:13:00Z'),
    readBy: ['c3d4e5f6-g7h8-9012-3456-789012cdefgh'],
  },
  {
    id: 'e4d5f6g7-0002-0000-0000-000000000014',
    threadId: 'e4d5f6g7-h8i9-0123-4567-890123defghi',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Sounds fun! When is it?',
    timestamp: new Date('2025-07-10T09:14:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  // Thread 5: demo-user-0002 and b2c3d4e5-f6g7-8901-2345-678901bcdefg
  {
    id: 'f5e6g7h8-0001-0000-0000-000000000015',
    threadId: 'f5e6g7h8-i9j0-1234-5678-901234efghij',
    senderId: '00000000-0000-0000-0000-000000000002',
    content: 'Sarah, are you joining the meeting later?',
    timestamp: new Date('2025-07-10T09:15:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000002'],
  },
  {
    id: 'f5e6g7h8-0002-0000-0000-000000000016',
    threadId: 'f5e6g7h8-i9j0-1234-5678-901234efghij',
    senderId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    content: 'Yes, I’ll be there!',
    timestamp: new Date('2025-07-10T09:16:00Z'),
    readBy: ['b2c3d4e5-f6g7-8901-2345-678901bcdefg'],
  },
  // Thread 6: a1b2c3d4-e5f6-7890-1234-567890abcdef and b2c3d4e5-f6g7-8901-2345-678901bcdefg
  {
    id: 'g6f7h8i9-0001-0000-0000-000000000017',
    threadId: 'g6f7h8i9-j1k2-3456-7890-abcdef123456',
    senderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    content: 'Hey Sarah, want to go shooting this weekend?',
    timestamp: new Date('2025-07-10T09:17:00Z'),
    readBy: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  },
  {
    id: 'g6f7h8i9-0002-0000-0000-000000000018',
    threadId: 'g6f7h8i9-j1k2-3456-7890-abcdef123456',
    senderId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
    content: 'Absolutely! Let’s plan it.',
    timestamp: new Date('2025-07-10T09:18:00Z'),
    readBy: ['b2c3d4e5-f6g7-8901-2345-678901bcdefg'],
  },
  // Thread 7: All Hands group chat
  {
    id: 'h7g8i9j0-0001-0000-0000-000000000019',
    threadId: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Welcome everyone to the All Hands chat!',
    timestamp: new Date('2025-07-10T09:21:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'h7g8i9j0-0002-0000-0000-000000000020',
    threadId: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567',
    senderId: 'd4e5f6g7-h8i9-0123-4567-890123defghi',
    content: 'Glad to be here!',
    timestamp: new Date('2025-07-10T09:22:00Z'),
    readBy: ['d4e5f6g7-h8i9-0123-4567-890123defghi'],
  },
  {
    id: 'h7g8i9j0-0003-0000-0000-000000000021',
    threadId: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567',
    senderId: 'f7g8h9i0-j1k2-3456-7890-abcdef123456',
    content: 'Looking forward to collaborating with everyone.',
    timestamp: new Date('2025-07-10T09:23:00Z'),
    readBy: ['f7g8h9i0-j1k2-3456-7890-abcdef123456'],
  },
  {
    id: 'h7g8i9j0-0004-0000-0000-000000000022',
    threadId: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567',
    senderId: 'h9i0j1k2-l3m4-5678-9012-cdef12345678',
    content: 'Excited for the new projects!',
    timestamp: new Date('2025-07-10T09:24:00Z'),
    readBy: ['h9i0j1k2-l3m4-5678-9012-cdef12345678'],
  },
  {
    id: 'h7g8i9j0-0005-0000-0000-000000000023',
    threadId: 'h7g8i9j0-k1l2-4567-8901-bcdef1234567',
    senderId: 'i0j1k2l3-m4n5-6789-0123-def123456789',
    content: 'Let’s make this a great year!',
    timestamp: new Date('2025-07-10T09:25:00Z'),
    readBy: ['i0j1k2l3-m4n5-6789-0123-def123456789'],
  },
  // Thread 8: Demo Admin direct chat with Demo User
  {
    id: 'b7e1a2c3-4d5f-4e6a-8b9c-1d2e3f4a5b6c',
    threadId: 'c8f2b3d4-5e6f-4a7b-9c8d-2e3f4a5b6c7d',
    senderId: '00000000-0000-0000-0000-000000000001', // Demo Admin
    content: 'Hi Demo User, let me know if you need any admin help!',
    timestamp: new Date('2025-07-10T10:00:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'd9e3c4b5-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
    threadId: 'c8f2b3d4-5e6f-4a7b-9c8d-2e3f4a5b6c7d',
    senderId: '00000000-0000-0000-0000-000000000002', // Demo User
    content: 'Thanks Admin! Will do.',
    timestamp: new Date('2025-07-10T10:01:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000002'],
  },
  // Thread 9: Demo Admin group announcement
  {
    id: 'e1f4a5b6-7c8d-4e9f-8a0b-1c2d3e4f5a6b',
    threadId: 'f2a3b4c5-6d7e-4f8a-9b0c-1d2e3f4a5b6c',
    senderId: '00000000-0000-0000-0000-000000000001',
    content: 'Reminder: System maintenance at 6pm today.',
    timestamp: new Date('2025-07-10T10:05:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  // Thread 10: Demo Admin direct chat with Alex Johnson
  {
    id: 'a2b3c4d5-8e9f-4a0b-9c1d-2e3f4a5b6c7d',
    threadId: 'b3c4d5e6-9f0a-4b1c-8d2e-3f4a5b6c7d8e',
    senderId: '00000000-0000-0000-0000-000000000001',
    content: 'Hi Alex, welcome to the platform!',
    timestamp: new Date('2025-07-10T10:10:00Z'),
    readBy: ['00000000-0000-0000-0000-000000000001'],
  },
  {
    id: 'c5d6e7f8-0a1b-4c2d-9e3f-4a5b6c7d8e9f',
    threadId: 'b3c4d5e6-9f0a-4b1c-8d2e-3f4a5b6c7d8e',
    senderId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    content: 'Thanks Admin! Happy to be here.',
    timestamp: new Date('2025-07-10T10:11:00Z'),
    readBy: ['a1b2c3d4-e5f6-7890-1234-567890abcdef'],
  },
];
