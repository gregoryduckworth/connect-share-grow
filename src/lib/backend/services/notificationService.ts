import { NOTIFICATIONS_DATA } from '../data/notifications';
import { USER_NOTIFICATIONS, UserNotification } from '../data/userNotifications';
import type { Notification } from '@/lib/types';

export const notificationService = {
  // Get all notifications for a user, with read state
  getUserNotifications: async (
    userId: string,
  ): Promise<Array<Notification & { readAt?: Date }>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userNotifs = USER_NOTIFICATIONS.filter((n) => n.userId === userId);
    return userNotifs
      .map((un) => {
        const notif = NOTIFICATIONS_DATA.find((n) => n.id === un.notificationId);
        return notif ? { ...notif, readAt: un.readAt } : undefined;
      })
      .filter(Boolean) as Array<Notification & { readAt?: Date }>;
  },

  // Mark a notification as read for a user
  markUserNotificationAsRead: async (userId: string, notificationId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const userNotif = USER_NOTIFICATIONS.find(
      (n) => n.userId === userId && n.notificationId === notificationId,
    );
    if (userNotif) {
      userNotif.readAt = new Date();
    }
  },
};
