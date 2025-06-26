import { useState } from "react";
import UserProfileDialog from "@/components/user/UserProfileDialog";

interface UserProfileLinkProps {
  userId: string;
  userName: string;
  currentUserId: string;
  className?: string;
  showConnectionButton?: boolean;
  children?: React.ReactNode;
}

const UserProfileLink = ({
  userId,
  userName,
  currentUserId,
  className = "",
  showConnectionButton = true,
  children,
}: UserProfileLinkProps) => {
  const [open, setOpen] = useState(false);
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
        {children || userName}
      </button>
      <UserProfileDialog
        userId={userId}
        isOpen={open}
        onClose={() => setOpen(false)}
        currentUserId={currentUserId}
        showConnectionButton={showConnectionButton}
      />
    </>
  );
};

export default UserProfileLink;
