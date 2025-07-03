import { useEffect, useState, useMemo, useCallback } from 'react';
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Session expiry handler
  const handleSessionExpiry = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiry');
    toast({
      title: 'Session expired',
      description: 'Your session has expired. Please log in again.',
    });
    navigate('/login');
  }, [navigate, toast]);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('auth_user');
    const sessionExpiry = localStorage.getItem('auth_expiry');
    const storedToken = localStorage.getItem('auth_token');
    const storedRefreshToken = localStorage.getItem('auth_refresh_token');

    if (storedUser && sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      if (expiryDate > new Date()) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken || null);
        setRefreshToken(storedRefreshToken || null);
      } else {
        // Session expired
        handleSessionExpiry();
      }
    }
    setIsLoading(false);
  }, [handleSessionExpiry]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const userData = mockUsers.find((u) => u.email === email);
      if (userData && password === 'password123') {
        const user: User = userData;
        setUser(user);
        // Simulate real backend: set fake tokens
        const fakeToken = 'mock-jwt-token';
        const fakeRefreshToken = 'mock-refresh-token';
        setToken(fakeToken);
        setRefreshToken(fakeRefreshToken);
        // Set session with 24-hour expiry
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_expiry', expiryDate.toISOString());
        localStorage.setItem('auth_token', fakeToken);
        localStorage.setItem('auth_refresh_token', fakeRefreshToken);
        // Show suspension dialog if user is suspended
        if (user.isSuspended) {
          setShowSuspensionDialog(true);
        }
        setIsLoading(false);
        return true;
      }
      setAuthError('Invalid email or password.');
      setIsLoading(false);
      return false;
    } catch (error) {
      setAuthError('An error occurred during login.');
      setIsLoading(false);
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      _password: string, // renamed to _password to indicate unused
      name: string,
      language: string,
    ): Promise<boolean> => {
      setIsLoading(true);
      setAuthError(null);
      try {
        // Mock registration - in real app, this would call Supabase
        // Simulate email verification requirement
        toast({
          title: t('auth.verificationSent'),
          description: 'Please check your email and click the verification link before logging in.',
        });
        setIsLoading(false);
        console.log('User registered:', { email, name, language });
        console.log('Verification email would be sent to:', email);
        return true;
      } catch (error) {
        setAuthError('An error occurred during registration.');
        setIsLoading(false);
        console.error('Registration error:', error);
        return false;
      }
    },
    [toast],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expiry');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/'); // Go to landing page after logout
  }, [navigate, toast]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isModerator = useCallback(
    () => user?.role === 'moderator' || user?.role === 'admin',
    [user],
  );
  const canPost = useCallback(
    () => Boolean(user && user.isEmailVerified && !user.isSuspended),
    [user],
  );

  // Stub for refreshAuthToken (to be implemented with real backend)
  const refreshAuthToken = useCallback(async () => {
    // Example: call backend to refresh token using refreshToken
    // For now, just log and do nothing
    if (!refreshToken) return;
    // const response = await api.refreshToken(refreshToken);
    // setToken(response.token);
    // localStorage.setItem('auth_token', response.token);
    console.log('Refreshing token with:', refreshToken);
  }, [refreshToken]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isLoading,
      authError,
      clearAuthError,
      login,
      register,
      logout,
      refreshAuthToken,
      isAdmin,
      isModerator,
      canPost,
    }),
    [
      user,
      token,
      refreshToken,
      isLoading,
      authError,
      clearAuthError,
      login,
      register,
      logout,
      refreshAuthToken,
      isAdmin,
      isModerator,
      canPost,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
