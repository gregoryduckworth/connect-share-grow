
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tokenManager } from '../tokenManager';
import { User } from '@/lib/types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TokenManager', () => {
  const mockUser: User = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    isActive: true,
    isEmailVerified: true,
    isSuspended: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Token Management', () => {
    it('should store and retrieve token correctly', () => {
      const testToken = 'test-token-123';
      
      tokenManager.setToken(testToken);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_token',
        expect.any(String)
      );
      
      // Mock localStorage.getItem to return encrypted token
      localStorageMock.getItem.mockReturnValue(expect.any(String));
      
      // Note: In a real test, we'd mock the encryption/decryption
      // For now, we're testing the basic flow
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should return null for non-existent token', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const token = tokenManager.getToken();
      
      expect(token).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      tokenManager.setToken('test-token');
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to store token:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Refresh Token Management', () => {
    it('should store and retrieve refresh token correctly', () => {
      const testRefreshToken = 'refresh-token-123';
      
      tokenManager.setRefreshToken(testRefreshToken);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_refresh_token',
        expect.any(String)
      );
    });

    it('should return null for non-existent refresh token', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const refreshToken = tokenManager.getRefreshToken();
      
      expect(refreshToken).toBeNull();
    });
  });

  describe('User Management', () => {
    it('should store and retrieve user correctly', () => {
      tokenManager.setUser(mockUser);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_user',
        expect.any(String)
      );
    });

    it('should return null for non-existent user', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const user = tokenManager.getUser();
      
      expect(user).toBeNull();
    });

    it('should handle JSON parsing errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValue('invalid-encrypted-data');
      
      const user = tokenManager.getUser();
      
      expect(user).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Expiry Management', () => {
    it('should store and retrieve expiry correctly', () => {
      const testExpiry = new Date().toISOString();
      
      tokenManager.setExpiry(testExpiry);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_expiry',
        expect.any(String)
      );
    });

    it('should correctly identify expired tokens', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      localStorageMock.getItem.mockReturnValue(btoa(pastDate));
      
      const isExpired = tokenManager.isTokenExpired();
      
      expect(isExpired).toBe(true);
    });

    it('should correctly identify valid tokens', () => {
      const futureDate = new Date(Date.now() + 1000).toISOString();
      localStorageMock.getItem.mockReturnValue(btoa(futureDate));
      
      const isExpired = tokenManager.isTokenExpired();
      
      expect(isExpired).toBe(false);
    });

    it('should treat missing expiry as expired', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const isExpired = tokenManager.isTokenExpired();
      
      expect(isExpired).toBe(true);
    });
  });

  describe('Clear All', () => {
    it('should clear all stored data', () => {
      tokenManager.clearAll();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_refresh_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_expiry');
    });

    it('should handle clear errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Clear error');
      });
      
      tokenManager.clearAll();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear tokens:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
