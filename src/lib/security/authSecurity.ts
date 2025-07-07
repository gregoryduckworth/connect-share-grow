
import { logger } from '@/lib/logging/logger';

// Security configuration
export const AUTH_CONFIG = {
  TOKEN_EXPIRY_HOURS: 24,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  SESSION_TIMEOUT_MINUTES: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
} as const;

// Enhanced token validation
export const validateToken = (token: string): boolean => {
  if (!token || token.length < 10) return false;
  
  // Check token format (jwt_timestamp_random)
  const tokenPattern = /^jwt_\d+_[a-zA-Z0-9]+$/;
  return tokenPattern.test(token);
};

// Secure session management
export class SessionManager {
  private static readonly SESSION_KEY = 'auth_session_data';
  private static readonly ACTIVITY_KEY = 'last_activity';

  static updateActivity(): void {
    try {
      localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());
    } catch (error) {
      logger.error('Failed to update activity timestamp', error);
    }
  }

  static isSessionExpired(): boolean {
    try {
      const lastActivity = localStorage.getItem(this.ACTIVITY_KEY);
      if (!lastActivity) return true;

      const timeDiff = Date.now() - parseInt(lastActivity);
      const timeoutMs = AUTH_CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000;
      
      return timeDiff > timeoutMs;
    } catch {
      return true;
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.ACTIVITY_KEY);
    } catch (error) {
      logger.error('Failed to clear session data', error);
    }
  }
}

// Rate limiting for login attempts
export class LoginRateLimiter {
  private static readonly ATTEMPTS_KEY = 'login_attempts';
  private static readonly LOCKOUT_KEY = 'login_lockout';

  static canAttemptLogin(email: string): boolean {
    try {
      const attemptsData = localStorage.getItem(this.ATTEMPTS_KEY);
      const lockoutData = localStorage.getItem(this.LOCKOUT_KEY);
      
      if (lockoutData) {
        const lockoutInfo = JSON.parse(lockoutData);
        if (lockoutInfo.email === email) {
          const lockoutExpiry = new Date(lockoutInfo.expiry);
          if (lockoutExpiry > new Date()) {
            return false; // Still locked out
          } else {
            // Lockout expired, clear it
            localStorage.removeItem(this.LOCKOUT_KEY);
          }
        }
      }

      if (attemptsData) {
        const attempts = JSON.parse(attemptsData);
        const userAttempts = attempts[email] || 0;
        return userAttempts < AUTH_CONFIG.MAX_LOGIN_ATTEMPTS;
      }

      return true;
    } catch {
      return true; // Allow login if we can't check
    }
  }

  static recordFailedAttempt(email: string): void {
    try {
      const attemptsData = localStorage.getItem(this.ATTEMPTS_KEY);
      const attempts = attemptsData ? JSON.parse(attemptsData) : {};
      
      attempts[email] = (attempts[email] || 0) + 1;
      localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));

      // Check if we need to lock out
      if (attempts[email] >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        const lockoutExpiry = new Date();
        lockoutExpiry.setMinutes(lockoutExpiry.getMinutes() + AUTH_CONFIG.LOCKOUT_DURATION_MINUTES);
        
        localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify({
          email,
          expiry: lockoutExpiry.toISOString()
        }));
        
        logger.warn('User locked out due to too many login attempts', { email });
      }
    } catch (error) {
      logger.error('Failed to record login attempt', error);
    }
  }

  static clearAttempts(email: string): void {
    try {
      const attemptsData = localStorage.getItem(this.ATTEMPTS_KEY);
      if (attemptsData) {
        const attempts = JSON.parse(attemptsData);
        delete attempts[email];
        localStorage.setItem(this.ATTEMPTS_KEY, JSON.stringify(attempts));
      }
      
      // Also clear any lockout
      const lockoutData = localStorage.getItem(this.LOCKOUT_KEY);
      if (lockoutData) {
        const lockoutInfo = JSON.parse(lockoutData);
        if (lockoutInfo.email === email) {
          localStorage.removeItem(this.LOCKOUT_KEY);
        }
      }
    } catch (error) {
      logger.error('Failed to clear login attempts', error);
    }
  }
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .trim();
};

// CSRF token generation (for future API integration)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
