
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Mail } from 'lucide-react';
import { t } from '@/lib/i18n';

interface PostingRestrictionProps {
  children: React.ReactNode;
  action?: string; // e.g., "post", "comment", "create community"
}

const PostingRestriction = ({ children, action = "post" }: PostingRestrictionProps) => {
  const { user, canPost } = useAuth();

  if (!user) {
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Login Required</AlertTitle>
        <AlertDescription>
          You need to be logged in to {action}.
        </AlertDescription>
      </Alert>
    );
  }

  if (!user.isEmailVerified) {
    return (
      <Alert className="border-orange-200 bg-orange-50">
        <Mail className="h-4 w-4 text-orange-500" />
        <AlertTitle className="text-orange-700">Email Verification Required</AlertTitle>
        <AlertDescription>
          Please verify your email address before you can {action}. Check your inbox for a verification link.
        </AlertDescription>
      </Alert>
    );
  }

  if (user.isSuspended) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-700">{t('auth.accountSuspended')}</AlertTitle>
        <AlertDescription>
          {t('auth.suspendedMessage')}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PostingRestriction;
