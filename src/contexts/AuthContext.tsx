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
import { tokenManager } from '@/lib/security/tokenManager';
import { logger } from '@/lib/logging/logger';
import { loginSchema, registerSchema } from '@/lib/validation/schemas';

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
    logger.info('Session expired for user', { userId: user?.id });
    setUser(null);
    tokenManager.clearAll();
    toast({
      title: 'Session expired',
      description: 'Your session has expired. Please log in again.',
    });
    navigate('/login');
  }, [navigate, toast, user?.id]);

  useEffect(() => {
    // Check for existing session
    const storedUser = tokenManager.getUser();
    const sessionExpiry = tokenManager.getExpiry();
    const storedToken = tokenManager.getToken();
    const storedRefreshToken = tokenManager.getRefreshToken();

    if (storedUser && sessionExpiry && !tokenManager.isTokenExpired()) {
      logger.info('Restoring user session', { userId: storedUser.id });
      setUser(storedUser);
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      logger.setUserId(storedUser.id);
    } else if (storedUser && tokenManager.isTokenExpired()) {
      logger.info('Found expired session, clearing tokens');
      handleSessionExpiry();
    }
    setIsLoading(false);
  }, [handleSessionExpiry]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Validate input
      const validationResult = loginSchema.safeParse({ email, password });
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message);
        setAuthError(errors.join(', '));
        setIsLoading(false);
        logger.warn('Login validation failed', { email, errors });
        return false;
      }

      logger.info('Attempting login', { email });
      
      const userData = mockUsers.find((u) => u.email === email);
      if (userData && password === 'password123') {
        const user: User = userData;
        setUser(user);
        
        // Generate secure tokens
        const fakeToken = `jwt_${Date.now()}_${Math.random().toString(36)}`;
        const fakeRefreshToken = `refresh_${Date.now()}_${Math.random().toString(36)}`;
        
        setToken(fakeToken);
        setRefreshToken(fakeRefreshToken);
        
        // Secure token storage
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);
        
        tokenManager.setUser(user);
        tokenManager.setExpiry(expiryDate.toISOString());
        tokenManager.setToken(fakeToken);
        tokenManager.setRefreshToken(fakeRefreshToken);
        
        logger.setUserId(user.id);
        logger.info('User logged in successfully', { userId: user.id, role: user.role });
        
        // Show suspension dialog if user is suspended
        if (user.isSuspended) {
          setShowSuspensionDialog(true);
          logger.warn('Suspended user logged in', { userId: user.id, reason: user.suspensionReason });
        }
        
        setIsLoading(false);
        return true;
      }
      
      logger.warn('Login failed - invalid credentials', { email });
      setAuthError('Invalid email or password.');
      setIsLoading(false);
      return false;
    } catch (error) {
      logger.error('Login error occurred', error);
      setAuthError('An error occurred during login.');
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      language: string,
    ): Promise<boolean> => {
      setIsLoading(true);
      setAuthError(null);
      
      try {
        // Validate input
        const validationResult = registerSchema.safeParse({ 
          email, 
          password, 
          name, 
          confirmPassword: password,
          dateOfBirth: '2000-01-01' // Mock for validation
        });
        
        if (!validationResult.success) {
          const errors = validationResult.error.errors.map(err => err.message);
          setAuthError(errors.join(', '));
          setIsLoading(false);
          logger.warn('Registration validation failed', { email, errors });
          return false;
        }

        logger.info('Attempting registration', { email, name, language });
        
        // Mock registration - in real app, this would call Supabase
        toast({
          title: t('auth.verificationSent'),
          description: 'Please check your email and click the verification link before logging in.',
        });
        
        logger.info('Registration successful', { email });
        setIsLoading(false);
        return true;
      } catch (error) {
        logger.error('Registration error occurred', error);
        setAuthError('An error occurred during registration.');
        setIsLoading(false);
        return false;
      }
    },
    [toast],
  );

  const logout = useCallback(() => {
    logger.info('User logging out', { userId: user?.id });
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    tokenManager.clearAll();
    logger.setUserId('');
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  }, [navigate, toast, user?.id]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isModerator = useCallback(
    () => user?.role === 'moderator' || user?.role === 'admin',
    [user],
  );
  const canPost = useCallback(
    () => Boolean(user && user.isEmailVerified && !user.isSuspended),
    [user],
  );

  const refreshAuthToken = useCallback(async () => {
    if (!refreshToken) {
      logger.warn('No refresh token available');
      return;
    }
    
    try {
      logger.info('Refreshing auth token');
      // In a real app, this would call the backend API
      // const response = await api.refreshToken(refreshToken);
      // setToken(response.token);
      // tokenManager.setToken(response.token);
      
      logger.info('Token refresh completed');
    } catch (error) {
      logger.error('Token refresh failed', error);
      handleSessionExpiry();
    }
  }, [refreshToken, handleSessionExpiry]);

  const updateUserProfile = useCallback(async (updatedUser: User): Promise<void> => {
    try {
      logger.info('Updating user profile', { userId: updatedUser.id });
      setUser(updatedUser);
      tokenManager.setUser(updatedUser);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      
      logger.info('User profile updated successfully', { userId: updatedUser.id });
    } catch (error) {
      logger.error('Profile update error occurred', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
      });
    }
  }, [toast]);

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
      updateUserProfile,
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
      updateUserProfile,
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
