
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Shield, Users, MessageSquare, AlertTriangle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminNotification {
  id: string;
  type: "community_approval" | "user_report" | "moderator_inactive" | "system_alert";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

const AdminNotificationBell = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: "admin-notif-1",
      type: "community_approval",
      title: "New Community Pending Approval",
      message: "Tech Discussions community is awaiting approval",
      timestamp: new Date(2024, 5, 20, 16, 30),
      isRead: false,
      priority: "medium"
    },
    {
      id: "admin-notif-2",
      type: "user_report",
      title: "New User Report",
      message: "User reported for inappropriate content in Photography community",
      timestamp: new Date(2024, 5, 20, 15, 45),
      isRead: false,
      priority: "high"
    },
    {
      id: "admin-notif-3",
      type: "moderator_inactive",
      title: "Inactive Moderator Alert",
      message: "Moderator in Cooking Adventures hasn't been active for 30 days",
      timestamp: new Date(2024, 5, 20, 14, 20),
      isRead: true,
      priority: "low"
    },
    {
      id: "admin-notif-4",
      type: "system_alert",
      title: "High Report Volume",
      message: "Unusual spike in user reports detected",
      timestamp: new Date(2024, 5, 20, 12, 15),
      isRead: false,
      priority: "high"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "community_approval":
        return <Users className="h-4 w-4" />;
      case "user_report":
        return <MessageSquare className="h-4 w-4" />;
      case "moderator_inactive":
        return <Shield className="h-4 w-4" />;
      case "system_alert":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
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
              <CardTitle className="text-lg">Admin Notifications</CardTitle>
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
                <div className="text-center p-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
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
                          : `border-l-social-primary bg-social-accent/10`
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          notification.type === "system_alert" || notification.type === "user_report" ? "bg-red-100 text-red-600" :
                          notification.type === "community_approval" ? "bg-blue-100 text-blue-600" :
                          "bg-orange-100 text-orange-600"
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <Badge className={`${getPriorityColor(notification.priority)} text-xs px-1`}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">
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

export default AdminNotificationBell;
