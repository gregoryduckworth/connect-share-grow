import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { t } from '@/lib/i18n';
import { mockUsers } from '@/lib/api';
import { User } from '@/lib/types';
import { AuthContext } from './AuthContextBase';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuspensionDialog, setShowSuspensionDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    const sessionExpiry = localStorage.getItem('auth_expiry');

    if (storedUser && sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (expiryDate > new Date()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_expiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use mockUsers from central api file (now an array)
      const userData = mockUsers.find((u) => u.email === email);
      if (userData && password === 'password123') {
        const user: User = userData;
        setUser(user);

        // Set session with 24-hour expiry
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_expiry', expiryDate.toISOString());

        // Show suspension dialog if user is suspended
        if (user.isSuspended) {
          setShowSuspensionDialog(true);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    _password: string, // renamed to _password to indicate unused
    name: string,
    language: string,
  ): Promise<boolean> => {
    try {
      // Mock registration - in real app, this would call Supabase

      // Simulate email verification requirement
      toast({
        title: t('auth.verificationSent'),
        description: 'Please check your email and click the verification link before logging in.',
      });

      console.log('User registered:', { email, name, language });
      console.log('Verification email would be sent to:', email);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiry');

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });

    navigate('/'); // Go to landing page after logout
  };

  const isAdmin = () => user?.role === 'admin';
  const isModerator = () => user?.role === 'moderator' || user?.role === 'admin';
  const canPost = () => Boolean(user && user.isEmailVerified && !user.isSuspended);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isModerator,
        canPost,
      }}
    >
      {children}

      {/* Suspension Dialog */}
      <Dialog open={showSuspensionDialog} onOpenChange={setShowSuspensionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t('auth.accountSuspended')}
            </DialogTitle>
            <DialogDescription className="text-left">
              {t('auth.suspendedMessage')}
            </DialogDescription>
          </DialogHeader>
          {user?.suspensionReason && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {user.suspensionReason}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};
