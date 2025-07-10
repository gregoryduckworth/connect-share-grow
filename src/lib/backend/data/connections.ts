import { USERS_DATA } from './users';
import { ConnectionData } from '@/lib/types';

export const CONNECTIONS_DATA: ConnectionData[] = [
  // Alex Johnson
  {
    userId: USERS_DATA[2].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: 'connected',
        lastActive: new Date('2024-06-19T10:00:00Z'),
      },
      {
        id: USERS_DATA[7].id, // Mike Rodriguez
        status: 'connected',
        lastActive: new Date('2024-06-15T09:00:00Z'),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: 'connected',
        lastActive: new Date('2024-06-14T09:00:00Z'),
      },
    ],
  },
  // Sarah Chen
  {
    userId: USERS_DATA[3].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: 'connected',
        lastActive: new Date('2024-06-20T12:00:00Z'),
      },
      {
        id: USERS_DATA[6].id, // David Kim
        status: 'connected',
        lastActive: new Date('2024-06-13T09:00:00Z'),
      },
      {
        id: USERS_DATA[9].id, // Liam O'Brien
        status: 'connected',
        lastActive: new Date('2024-06-12T09:00:00Z'),
      },
    ],
  },
  // Mike Rodriguez
  {
    userId: USERS_DATA[4].id,
    connections: [
      {
        id: USERS_DATA[5].id, // David Kim
        status: 'connected',
        lastActive: new Date('2024-06-11T09:00:00Z'),
      },
      {
        id: USERS_DATA[7].id, // Mike Rodriguez
        status: 'connected',
        lastActive: new Date('2024-06-10T09:00:00Z'),
      },
    ],
  },
  // David Kim
  {
    userId: USERS_DATA[6].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: 'connected',
        lastActive: new Date('2024-06-13T09:00:00Z'),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: 'connected',
        lastActive: new Date('2024-06-09T09:00:00Z'),
      },
    ],
  },
  // Priya Patel
  {
    userId: USERS_DATA[7].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: 'connected',
        lastActive: new Date('2024-06-15T09:00:00Z'),
      },
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: 'connected',
        lastActive: new Date('2024-06-10T09:00:00Z'),
      },
    ],
  },
  // Liam O'Brien
  {
    userId: USERS_DATA[8].id,
    connections: [
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: 'connected',
        lastActive: new Date('2024-06-14T09:00:00Z'),
      },
      {
        id: USERS_DATA[6].id, // David Kim
        status: 'connected',
        lastActive: new Date('2024-06-09T09:00:00Z'),
      },
      {
        id: USERS_DATA[9].id, // Sofia Rossi
        status: 'connected',
        lastActive: new Date('2024-06-07T09:00:00Z'),
      },
    ],
  },
  // Sofia Rossi
  {
    userId: USERS_DATA[9].id,
    connections: [
      {
        id: USERS_DATA[3].id, // Sarah Chen
        status: 'connected',
        lastActive: new Date('2024-06-12T09:00:00Z'),
      },
      {
        id: USERS_DATA[8].id, // Priya Patel
        status: 'connected',
        lastActive: new Date('2024-06-07T09:00:00Z'),
      },
    ],
  },
  // Lucas Müller
  {
    userId: USERS_DATA[10]?.id,
    connections: [
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: 'connected',
        lastActive: new Date('2024-06-11T09:00:00Z'),
      },
    ],
  },
  // Demo Admin User
  {
    userId: USERS_DATA[0].id, // Demo Admin
    connections: [
      {
        id: USERS_DATA[1].id, // Demo User
        status: 'connected',
        lastActive: new Date('2025-07-10T09:59:00Z'),
      },
      {
        id: USERS_DATA[2].id, // Alex Johnson
        status: 'connected',
        lastActive: new Date('2025-07-10T11:09:00Z'),
      },
      {
        id: USERS_DATA[4].id, // Mike Rodriguez
        status: 'connected',
        lastActive: new Date('2025-07-10T10:12:00Z'),
      },
      {
        id: USERS_DATA[5].id, // Emma Wilson
        status: 'connected',
        lastActive: new Date('2025-07-10T10:15:00Z'),
      },
      {
        id: USERS_DATA[7].id, // Priya Patel
        status: 'connected',
        lastActive: new Date('2025-07-10T16:23:00Z'),
      },
    ],
  },
];
