import { FC, ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AppAvatarProps {
  size?: string; // e.g. "h-10 w-10"
  className?: string;
  children?: ReactNode;
}

const AppAvatar: FC<AppAvatarProps> = ({
  size = "h-10 w-10",
  className = "",
  children,
}) => (
  <Avatar
    className={`${size} bg-social-primary text-white ${className}`.trim()}
  >
    {children ? (
      children
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <User className="h-5 w-5" />
      </div>
    )}
  </Avatar>
);

export default AppAvatar;
