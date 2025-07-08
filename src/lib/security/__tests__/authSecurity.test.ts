
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateToken, SessionManager, LoginRateLimiter, sanitizeInput, generateCSRFToken } from '../authSecurity';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthSecurity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('validateToken', () => {
    it('should validate correct token format', () => {
      const validToken = 'jwt_1234567890_abcdefgh';
      expect(validateToken(validToken)).toBe(true);
    });

    it('should reject invalid token formats', () => {
      expect(validateToken('')).toBe(false);
      expect(validateToken('short')).toBe(false);
      expect(validateToken('invalid_format')).toBe(false);
      expect(validateToken('jwt_invalid')).toBe(false);
    });

    it('should reject tokens without proper structure', () => {
      expect(validateToken('jwt_1234567890')).toBe(false);
      expect(validateToken('notjwt_1234567890_abcdefgh')).toBe(false);
    });
  });

  describe('SessionManager', () => {
    describe('updateActivity', () => {
      it('should update last activity timestamp', () => {
        const now = Date.now();
        vi.setSystemTime(now);
        
        SessionManager.updateActivity();
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith('last_activity', now.toString());
      });

      it('should handle storage errors gracefully', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorageMock.setItem.mockImplementation(() => {
          throw new Error('Storage error');
        });
        
        expect(() => SessionManager.updateActivity()).not.toThrow();
        consoleSpy.mockRestore();
      });
    });

    describe('isSessionExpired', () => {
      it('should return true for expired sessions', () => {
        const oldTime = Date.now() - (35 * 60 * 1000); // 35 minutes ago
        localStorageMock.getItem.mockReturnValue(oldTime.toString());
        
        const isExpired = SessionManager.isSessionExpired();
        
        expect(isExpired).toBe(true);
      });

      it('should return false for valid sessions', () => {
        const recentTime = Date.now() - (10 * 60 * 1000); // 10 minutes ago
        localStorageMock.getItem.mockReturnValue(recentTime.toString());
        
        const isExpired = SessionManager.isSessionExpired();
        
        expect(isExpired).toBe(false);
      });

      it('should return true when no activity recorded', () => {
        localStorageMock.getItem.mockReturnValue(null);
        
        const isExpired = SessionManager.isSessionExpired();
        
        expect(isExpired).toBe(true);
      });
    });

    describe('clearSession', () => {
      it('should clear session data', () => {
        SessionManager.clearSession();
        
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_session_data');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('last_activity');
      });
    });
  });

  describe('LoginRateLimiter', () => {
    const testEmail = 'test@example.com';

    describe('canAttemptLogin', () => {
      it('should allow login when no previous attempts', () => {
        localStorageMock.getItem.mockReturnValue(null);
        
        const canAttempt = LoginRateLimiter.canAttemptLogin(testEmail);
        
        expect(canAttempt).toBe(true);
      });

      it('should allow login when under limit', () => {
        const attempts = { [testEmail]: 3 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(attempts));
        
        const canAttempt = LoginRateLimiter.canAttemptLogin(testEmail);
        
        expect(canAttempt).toBe(true);
      });

      it('should deny login when at limit', () => {
        const attempts = { [testEmail]: 5 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(attempts));
        
        const canAttempt = LoginRateLimiter.canAttemptLogin(testEmail);
        
        expect(canAttempt).toBe(false);
      });

      it('should check lockout status', () => {
        const lockoutExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in future
        const lockoutData = {
          email: testEmail,
          expiry: lockoutExpiry.toISOString()
        };
        
        localStorageMock.getItem.mockImplementation((key) => {
          if (key === 'login_lockout') return JSON.stringify(lockoutData);
          return null;
        });
        
        const canAttempt = LoginRateLimiter.canAttemptLogin(testEmail);
        
        expect(canAttempt).toBe(false);
      });
    });

    describe('recordFailedAttempt', () => {
      it('should increment failed attempts', () => {
        const existingAttempts = { [testEmail]: 2 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(existingAttempts));
        
        LoginRateLimiter.recordFailedAttempt(testEmail);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'login_attempts',
          JSON.stringify({ [testEmail]: 3 })
        );
      });

      it('should create lockout when limit reached', () => {
        const existingAttempts = { [testEmail]: 4 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(existingAttempts));
        
        LoginRateLimiter.recordFailedAttempt(testEmail);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'login_lockout',
          expect.stringContaining(testEmail)
        );
      });
    });

    describe('clearAttempts', () => {
      it('should clear attempts for user', () => {
        const attempts = { [testEmail]: 3, 'other@example.com': 2 };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(attempts));
        
        LoginRateLimiter.clearAttempts(testEmail);
        
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'login_attempts',
          JSON.stringify({ 'other@example.com': 2 })
        );
      });
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should remove javascript: URLs', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      
      expect(result).not.toContain('javascript:');
    });

    it('should trim whitespace', () => {
      const input = '  test input  ';
      const result = sanitizeInput(input);
      
      expect(result).toBe('test input');
    });
  });

  describe('generateCSRFToken', () => {
    it('should generate a token', () => {
      const token = generateCSRFToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes * 2 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(token1).not.toBe(token2);
    });
  });
});
