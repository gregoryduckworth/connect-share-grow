
import { describe, it, expect, vi } from 'vitest';
import { ErrorHandler, ErrorType } from '../ErrorHandler';

// Mock logger
vi.mock('@/lib/logging/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('ErrorHandler', () => {
  describe('createError', () => {
    it('should create error with all properties', () => {
      const error = ErrorHandler.createError(
        ErrorType.VALIDATION,
        'Test error message',
        'TEST_001',
        { field: 'email' }
      );

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('TEST_001');
      expect(error.details).toEqual({ field: 'email' });
      expect(error.timestamp).toBeDefined();
    });

    it('should create error without optional properties', () => {
      const error = ErrorHandler.createError(
        ErrorType.NETWORK,
        'Network error'
      );

      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.message).toBe('Network error');
      expect(error.code).toBeUndefined();
      expect(error.details).toBeUndefined();
    });
  });

  describe('handleAuthError', () => {
    it('should handle invalid credentials error', () => {
      const inputError = { code: 'INVALID_CREDENTIALS' };
      const result = ErrorHandler.handleAuthError(inputError);

      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      expect(result.message).toBe('Invalid email or password');
      expect(result.code).toBe('AUTH_001');
    });

    it('should handle account locked error', () => {
      const inputError = { code: 'ACCOUNT_LOCKED' };
      const result = ErrorHandler.handleAuthError(inputError);

      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      expect(result.message).toBe('Account temporarily locked due to too many failed attempts');
      expect(result.code).toBe('AUTH_002');
    });

    it('should handle session expired error', () => {
      const inputError = { code: 'SESSION_EXPIRED' };
      const result = ErrorHandler.handleAuthError(inputError);

      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      expect(result.message).toBe('Your session has expired. Please log in again');
      expect(result.code).toBe('AUTH_003');
    });

    it('should handle generic auth error', () => {
      const inputError = { code: 'UNKNOWN_AUTH_ERROR' };
      const result = ErrorHandler.handleAuthError(inputError);

      expect(result.type).toBe(ErrorType.AUTHENTICATION);
      expect(result.message).toBe('Authentication failed. Please try again');
      expect(result.code).toBe('AUTH_000');
    });
  });

  describe('handleValidationError', () => {
    it('should handle Zod validation error with issues', () => {
      const inputError = {
        issues: [
          { message: 'Email is required' },
          { message: 'Password must be at least 8 characters' }
        ]
      };
      const result = ErrorHandler.handleValidationError(inputError);

      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.message).toBe('Email is required, Password must be at least 8 characters');
      expect(result.code).toBe('VAL_001');
    });

    it('should handle validation error with simple message', () => {
      const inputError = { message: 'Invalid input' };
      const result = ErrorHandler.handleValidationError(inputError);

      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.message).toBe('Invalid input');
      expect(result.code).toBe('VAL_001');
    });

    it('should handle validation error without message', () => {
      const inputError = {};
      const result = ErrorHandler.handleValidationError(inputError);

      expect(result.type).toBe(ErrorType.VALIDATION);
      expect(result.message).toBe('Invalid input provided');
      expect(result.code).toBe('VAL_001');
    });
  });

  describe('handleNetworkError', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        configurable: true,
      });
    });

    it('should handle offline error', () => {
      Object.defineProperty(global, 'navigator', {
        value: { onLine: false },
        configurable: true,
      });

      const result = ErrorHandler.handleNetworkError({});

      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('No internet connection. Please check your network and try again');
      expect(result.code).toBe('NET_001');
    });

    it('should handle timeout error', () => {
      Object.defineProperty(global, 'navigator', {
        value: { onLine: true },
        configurable: true,
      });

      const inputError = { code: 'TIMEOUT' };
      const result = ErrorHandler.handleNetworkError(inputError);

      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('Request timed out. Please try again');
      expect(result.code).toBe('NET_002');
    });

    it('should handle generic network error', () => {
      Object.defineProperty(global, 'navigator', {
        value: { onLine: true },
        configurable: true,
      });

      const result = ErrorHandler.handleNetworkError({});

      expect(result.type).toBe(ErrorType.NETWORK);
      expect(result.message).toBe('Network error occurred. Please try again');
      expect(result.code).toBe('NET_000');
    });
  });

  describe('handleGenericError', () => {
    it('should handle error with message', () => {
      const inputError = { message: 'Something went wrong' };
      const result = ErrorHandler.handleGenericError(inputError);

      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('Something went wrong');
      expect(result.code).toBe('GEN_000');
    });

    it('should handle error without message', () => {
      const result = ErrorHandler.handleGenericError({});

      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.message).toBe('An unexpected error occurred');
      expect(result.code).toBe('GEN_000');
    });
  });

  describe('getErrorMessage', () => {
    it('should format authentication error message', () => {
      const error = ErrorHandler.createError(ErrorType.AUTHENTICATION, 'Invalid credentials');
      const message = ErrorHandler.getErrorMessage(error);

      expect(message).toBe('Invalid credentials');
    });

    it('should format validation error message', () => {
      const error = ErrorHandler.createError(ErrorType.VALIDATION, 'Required field missing');
      const message = ErrorHandler.getErrorMessage(error);

      expect(message).toBe('Validation Error: Required field missing');
    });

    it('should format network error message', () => {
      const error = ErrorHandler.createError(ErrorType.NETWORK, 'Connection failed');
      const message = ErrorHandler.getErrorMessage(error);

      expect(message).toBe('Connection Error: Connection failed');
    });

    it('should format generic error message', () => {
      const error = ErrorHandler.createError(ErrorType.UNKNOWN, 'Unknown error');
      const message = ErrorHandler.getErrorMessage(error);

      expect(message).toBe('Unknown error');
    });
  });

  describe('shouldRetry', () => {
    it('should retry network errors except offline', () => {
      const networkError = ErrorHandler.createError(ErrorType.NETWORK, 'Network error', 'NET_002');
      expect(ErrorHandler.shouldRetry(networkError)).toBe(true);
    });

    it('should not retry offline errors', () => {
      const offlineError = ErrorHandler.createError(ErrorType.NETWORK, 'Offline', 'NET_001');
      expect(ErrorHandler.shouldRetry(offlineError)).toBe(false);
    });

    it('should not retry non-network errors', () => {
      const authError = ErrorHandler.createError(ErrorType.AUTHENTICATION, 'Auth error');
      expect(ErrorHandler.shouldRetry(authError)).toBe(false);
    });
  });
});
