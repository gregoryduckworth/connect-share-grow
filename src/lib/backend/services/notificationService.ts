
import { NOTIFICATIONS_DATA } from "../data/notifications";
import type { Notification } from "@/lib/types";

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return NOTIFICATIONS_DATA;
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const notification = NOTIFICATIONS_DATA.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
    }
  },
};
