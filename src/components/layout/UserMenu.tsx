
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Upload, Bell, BellOff, MessageSquare, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

interface Notification {
  id: string;
  type: "reply" | "comment" | "mention" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postId?: string;
  userId?: string;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      type: "reply",
      title: "New reply to your post",
      message: "Alice Johnson replied to your post about photography",
      timestamp: new Date(2024, 5, 20, 14, 30),
      isRead: false,
      postId: "post-1",
      userId: "user-1"
    },
    {
      id: "notif-2",
      type: "comment",
      title: "New comment on your post",
      message: "Bob Smith commented on your community post",
      timestamp: new Date(2024, 5, 20, 12, 15),
      isRead: false,
      postId: "post-2",
      userId: "user-2"
    },
    {
      id: "notif-3",
      type: "system",
      title: "Post locked",
      message: "Your post has been locked by a moderator",
      timestamp: new Date(2024, 5, 19, 10, 30),
      isRead: true,
      postId: "post-4"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a service like AWS S3
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const markAsRead =  (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 justify-start gap-3 w-full relative">
          <div className="relative">
            <Avatar className="h-8 w-8 bg-social-primary text-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
            </Avatar>
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-[1.25rem] h-5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {/* User Info */}
        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-social-primary text-white">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {user.name.charAt(0)}
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Avatar Upload */}
        <div className="px-2 py-1">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm">
              <Upload className="mr-2 h-4 w-4" />
              <span>Upload Avatar</span>
            </div>
          </label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        <DropdownMenuSeparator />

        {/* Notifications */}
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Notifications</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 cursor-pointer hover:bg-gray-50 rounded border-l-2 ${
                    notification.isRead 
                      ? "border-l-transparent bg-gray-50/50" 
                      : "border-l-social-primary bg-social-accent/10"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-full ${
                      notification.type === "system" ? "bg-orange-100 text-orange-600" :
                      notification.type === "mention" ? "bg-blue-100 text-blue-600" :
                      "bg-green-100 text-green-600"
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-1.5 h-1.5 bg-social-primary rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
