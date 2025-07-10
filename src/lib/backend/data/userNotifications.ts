// User-Notification join table
export interface UserNotification {
  userId: string;
  notificationId: string;
  readAt?: Date;
}

export const USER_NOTIFICATIONS: UserNotification[] = [
  {
    userId: 'demo-user-0001',
    notificationId: 'n1a2b3c4-d5e6-f789-0123-456789abcdef',
    readAt: new Date('2024-01-25T16:00:00Z'),
  },
  {
    userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    notificationId: 'n2b3c4d5-e6f7-g890-1234-567890bcdefg',
  },
  {
    userId: 'demo-admin-0001',
    notificationId: 'n3c4d5e6-f7g8-h901-2345-678901cdefgh',
    readAt: new Date('2024-01-23T13:00:00Z'),
  },
  // Additional demo notifications for demo-admin-0001
  {
    userId: 'demo-admin-0001',
    notificationId: 'n1a2b3c4-d5e6-f789-0123-456789abcdef',
  },
  {
    userId: 'demo-admin-0001',
    notificationId: 'n2b3c4d5-e6f7-g890-1234-567890bcdefg',
  },
];
