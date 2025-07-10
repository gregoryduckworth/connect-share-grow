import { USERS_DATA } from './users';
import { ConnectionRequest } from '@/lib/types';

export const CONNECTION_REQUESTS: ConnectionRequest[] = [
  // Only requests where there is no established connection in either direction
  // Mike Rodriguez requests to connect with Demo Admin
  {
    fromUserId: USERS_DATA[4].id, // Mike Rodriguez
    toUserId: USERS_DATA[0].id, // Demo Admin
    message: 'Hello Admin, can you help me with wellness content moderation?',
    date: new Date('2025-07-10T11:00:00Z').toISOString(),
  },
  // Priya Patel requests to connect with Demo Admin
  {
    fromUserId: USERS_DATA[7].id, // Priya Patel
    toUserId: USERS_DATA[0].id, // Demo Admin
    message: 'Would love to connect and share recipes!',
    date: new Date('2025-07-10T12:00:00Z').toISOString(),
  },
  // David Kim requests to connect with Sarah Chen (not connected in either direction)
  {
    fromUserId: USERS_DATA[6].id, // David Kim
    toUserId: USERS_DATA[3].id, // Sarah Chen
    message: 'Let’s connect and talk about tech!',
    date: new Date('2024-06-17T09:00:00Z').toISOString(),
  },
  // Sofia Rossi requests to connect with Mike Rodriguez (not connected in either direction)
  {
    fromUserId: USERS_DATA[9].id, // Sofia Rossi
    toUserId: USERS_DATA[4].id, // Mike Rodriguez
    message: 'Interested in collaborating on wellness topics.',
    date: new Date('2024-06-06T09:00:00Z').toISOString(),
  },
  // Demo User requests to connect with Priya Patel (not connected in either direction)
  {
    fromUserId: USERS_DATA[1].id, // Demo User
    toUserId: USERS_DATA[7].id, // Priya Patel
    message: 'Hi Priya, let’s share some recipes!',
    date: new Date('2025-07-10T13:00:00Z').toISOString(),
  },
  // Demo Admin requests to connect with Lucas Müller (not connected in either direction)
  {
    fromUserId: USERS_DATA[0].id, // Demo Admin
    toUserId: USERS_DATA[10].id, // Lucas Müller
    message: 'Hi Lucas, would you like to join our music community project?',
    date: new Date('2025-07-10T15:00:00Z').toISOString(),
  },
];
