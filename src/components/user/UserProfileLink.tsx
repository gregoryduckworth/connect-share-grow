import { useState, useEffect } from "react";
import UserProfileDialog from "@/components/user/UserProfileDialog";
import { userService } from "@/lib/backend/services/userService";
import type { User } from "@/lib/types";

interface UserProfileLinkProps {
  userId: string;
  userName?: string;
  className?: string;
  showConnectionButton?: boolean;
  children?: React.ReactNode;
}

const UserProfileLink = ({
  userId,
  userName,
  className = "",
  showConnectionButton = true,
  children,
}: UserProfileLinkProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userName) return; // No need to fetch if name is provided
    let mounted = true;
    userService.getUserById(userId).then((u) => {
      if (mounted) setUser(u || null);
    });
    return () => {
      mounted = false;
    };
  }, [userId, userName]);

  return (
    <>
      <button
        type="button"
        className={`text-social-primary hover:underline cursor-pointer ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {children || userName || user?.name || userId}
      </button>
      <UserProfileDialog
        userId={userId}
        isOpen={open}
        onClose={() => setOpen(false)}
        showConnectionButton={showConnectionButton}
      />
    </>
  );
};

export default UserProfileLink;
