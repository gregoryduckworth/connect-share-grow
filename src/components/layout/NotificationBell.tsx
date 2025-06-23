
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, MessageSquare, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notification {
  id: string;
  type: "reply" | "comment" | "mention" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postId?: string;
  userId?: string;
  communityId?: string;
}

const NotificationBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "reply",
      title: "New reply to your post",
      message: "Alice Johnson replied to your post 'Golden Hour Landscape Tips'",
      timestamp: new Date(2024, 5, 20, 14, 30),
      isRead: false,
      postId: "post-1",
      communityId: "photography",
      userId: "user-1"
    },
    {
      id: "notif-2",
      type: "comment",
      title: "New comment on your post",
      message: "Bob Smith commented on your post 'Street Photography Ethics'",
      timestamp: new Date(2024, 5, 20, 12, 15),
      isRead: false,
      postId: "post-2",
      communityId: "photography",
      userId: "user-2"
    },
    {
      id: "notif-3",
      type: "mention",
      title: "You were mentioned",
      message: "Carol Davis mentioned you in a comment",
      timestamp: new Date(2024, 5, 19, 16, 45),
      isRead: true,
      postId: "post-3",
      communityId: "general",
      userId: "user-3"
    },
    {
      id: "notif-4",
      type: "system",
      title: "Post locked",
      message: "Your post 'Camera Gear Recommendations' has been locked by a moderator",
      timestamp: new Date(2024, 5, 19, 10, 30),
      isRead: false,
      postId: "post-4",
      communityId: "photography"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Navigate to the relevant post or page based on notification type
    if (notification.postId && notification.communityId) {
      navigate(`/community/${notification.communityId}/post/${notification.postId}`);
    } else if (notification.type === "system") {
      // For system notifications, we can navigate to a general page or stay on current
      console.log("System notification clicked");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      case "mention":
        return <User className="h-4 w-4" />;
      case "system":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-left p-8">
                  <Bell className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 ${
                        notification.isRead 
                          ? "border-l-transparent bg-gray-50/50" 
                          : "border-l-social-primary bg-social-accent/10"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          notification.type === "system" ? "bg-orange-100 text-orange-600" :
                          notification.type === "mention" ? "bg-blue-100 text-blue-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-social-primary rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
