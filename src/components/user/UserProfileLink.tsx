import { useState, useEffect } from 'react';
import UserProfileDialog from '@/components/user/UserProfileDialog';
import { userService } from '@/lib/backend/services/userService';
import { useDialog } from '@/hooks/useDialog';
import type { User } from '@/lib/types';

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
  className = '',
  showConnectionButton = true,
  children,
}: UserProfileLinkProps) => {
  const [user, setUser] = useState<User | null>(null);
  const profileDialog = useDialog(false);

  useEffect(() => {
    if (userName) return;
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
          profileDialog.open();
        }}
      >
        {children || userName || user?.name ? (
          children || userName || user?.name
        ) : (
          <span className="inline-block w-16 h-4 bg-gray-200 animate-pulse rounded" />
        )}
      </button>
      <UserProfileDialog
        userId={userId}
        isOpen={profileDialog.isOpen}
        onClose={profileDialog.close}
        showConnectionButton={showConnectionButton}
      />
    </>
  );
};

export default UserProfileLink;
