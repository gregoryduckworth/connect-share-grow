
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
import { loginSchema, registerSchema } from '@/lib/validation/authSchemas';
import {
  SessionManager,
  LoginRateLimiter,
  validateToken,
  sanitizeInput,
} from '@/lib/security/authSecurity';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ErrorType } from '@/lib/errors/ErrorHandler';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuspensionDialog, setShowSuspensionDialog] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleError, handleAsyncError } = useErrorHandler();

  // Session expiry handler
  const handleSessionExpiry = useCallback(() => {
    logger.info('Session expired for user', { userId: user?.id });
    setUser(null);
    tokenManager.clearAll();
    SessionManager.clearSession();
    toast({
      title: 'Session expired',
      description: 'Your session has expired. Please log in again.',
    });
    navigate('/login');
  }, [navigate, toast, user?.id]);

  // Check session activity
  useEffect(() => {
    const checkSession = () => {
      if (user && SessionManager.isSessionExpired()) {
        handleSessionExpiry();
      } else if (user) {
        SessionManager.updateActivity();
      }
    };

    // Check session every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [user, handleSessionExpiry]);

  useEffect(() => {
    // Check for existing session
    const storedUser = tokenManager.getUser();
    const sessionExpiry = tokenManager.getExpiry();
    const storedToken = tokenManager.getToken();
    const storedRefreshToken = tokenManager.getRefreshToken();

    // Debug: Log expiry and current time before session check
    if (sessionExpiry) {
      const expiryDate = new Date(sessionExpiry);
      const now = new Date();
      logger.info('[AuthContext] Debug expiry check', {
        sessionExpiry,
        expiryDate: expiryDate.toISOString(),
        now: now.toISOString(),
        expired: expiryDate <= now,
      });
    }

    if (
      storedUser &&
      sessionExpiry &&
      !tokenManager.isTokenExpired() &&
      validateToken(storedToken || '')
    ) {
      logger.info('Restoring user session', { userId: storedUser.id });
      setUser(storedUser);
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      logger.setUserId(storedUser.id);
      SessionManager.updateActivity();
    } else if (storedUser && (tokenManager.isTokenExpired() || !validateToken(storedToken || ''))) {
      logger.info('Found expired or invalid session, clearing tokens');
      handleSessionExpiry();
    }
    setIsLoading(false);
  }, [handleSessionExpiry]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const result = await handleAsyncError(async () => {
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        // Check rate limiting
        if (!LoginRateLimiter.canAttemptLogin(sanitizedEmail)) {
          throw {
            type: ErrorType.AUTHENTICATION,
            code: 'ACCOUNT_LOCKED',
            message: 'Too many failed login attempts. Please try again later.',
          };
        }

        // Validate input
        const validationResult = loginSchema.safeParse({
          email: sanitizedEmail,
          password: sanitizedPassword,
        });

        if (!validationResult.success) {
          throw validationResult.error;
        }

        const userData = mockUsers.find((u) => u.email === sanitizedEmail);
        if (userData && sanitizedPassword === 'password123') {
          const user: User = userData;
          setUser(user);

          // Generate secure tokens
          const fakeToken = `jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          const fakeRefreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;

          setToken(fakeToken);
          setRefreshToken(fakeRefreshToken);

          // Secure token storage
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 24);

          tokenManager.setUser(user);
          tokenManager.setExpiry(expiryDate.toISOString());
          tokenManager.setToken(fakeToken);
          tokenManager.setRefreshToken(fakeRefreshToken);

          // Update session activity
          SessionManager.updateActivity();

          // Clear failed attempts
          LoginRateLimiter.clearAttempts(sanitizedEmail);

          // Show suspension dialog if user is suspended
          if (user.isSuspended) {
            setShowSuspensionDialog(true);
            logger.warn('Suspended user logged in', {
              userId: user.id,
              reason: user.suspensionReason,
            });
          }

          return true;
        }

        // Record failed attempt
        LoginRateLimiter.recordFailedAttempt(sanitizedEmail);

        throw {
          type: ErrorType.AUTHENTICATION,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        };
      }, 'user login');

      setIsLoading(false);
      return result.success;
    },
    [handleAsyncError],
  );

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<boolean> => {
      const result = await handleAsyncError(
        async () => {
          // Sanitize inputs
          const sanitizedEmail = sanitizeInput(email);
          const sanitizedName = sanitizeInput(name);
          const sanitizedPassword = sanitizeInput(password);

          // Validate input
          const validationResult = registerSchema.safeParse({
            email: sanitizedEmail,
            password: sanitizedPassword,
            name: sanitizedName,
            confirmPassword: sanitizedPassword,
            dateOfBirth: '2000-01-01', // Mock for validation
          });

          if (!validationResult.success) {
            throw validationResult.error;
          }

          // Mock registration - in real app, this would call Supabase
          toast({
            title: t('auth.verificationSent'),
            description:
              'Please check your email and click the verification link before logging in.',
          });

          return true;
        },
        'user registration',
        {
          showSuccessToast: false, // We're showing custom toast above
        },
      );

      setIsLoading(false);
      return result.success;
    },
    [handleAsyncError, toast],
  );

  const logout = useCallback(() => {
    logger.info('User logging out', { userId: user?.id });
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    tokenManager.clearAll();
    SessionManager.clearSession();
    logger.setUserId('');

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  }, [navigate, toast, user?.id]);

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
    } catch (error) {
      logger.error('Token refresh failed', error);
      handleSessionExpiry();
    }
  }, [refreshToken, handleSessionExpiry]);

  const updateUserProfile = useCallback(
    async (updatedUser: User): Promise<void> => {
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
        handleError(error, 'profile update');
      }
    },
    [handleError, toast],
  );

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
      isAdmin: () => user?.role === 'admin',
      isModerator: () => user?.role === 'moderator' || user?.role === 'admin',
      canPost: () => Boolean(user && user.isEmailVerified && !user.isSuspended),
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
