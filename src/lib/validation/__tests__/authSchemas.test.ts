
import { describe, it, expect } from 'vitest';
import { 
  loginSchema, 
  registerSchema, 
  passwordResetSchema, 
  changePasswordSchema 
} from '../authSchemas';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPass123!',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.password).toBe('ValidPass123!');
      }
    });

    it('should transform email to lowercase and trim', () => {
      const data = {
        email: '  TEST@EXAMPLE.COM  ',
        password: 'ValidPass123!',
      };

      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'ValidPass123!',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result1 = loginSchema.safeParse({ email: 'test@example.com' });
      const result2 = loginSchema.safeParse({ password: 'ValidPass123!' });
      
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    const validRegisterData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'ValidPass123!',
      confirmPassword: 'ValidPass123!',
      dateOfBirth: '1990-01-01',
    };

    it('should validate correct registration data', () => {
      const result = registerSchema.safeParse(validRegisterData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid name', () => {
      const invalidData = {
        ...validRegisterData,
        name: 'A', // Too short
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name with invalid characters', () => {
      const invalidData = {
        ...validRegisterData,
        name: 'John123', // Contains numbers
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        ...validRegisterData,
        password: 'weakpass', // No uppercase, number, or special char
        confirmPassword: 'weakpass',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        ...validRegisterData,
        confirmPassword: 'DifferentPass123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid age', () => {
      const tooYoung = {
        ...validRegisterData,
        dateOfBirth: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 years old
      };

      const tooOld = {
        ...validRegisterData,
        dateOfBirth: '1900-01-01', // 124 years old
      };

      const result1 = registerSchema.safeParse(tooYoung);
      const result2 = registerSchema.safeParse(tooOld);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });

    it('should accept valid age range', () => {
      const validAge = {
        ...validRegisterData,
        dateOfBirth: new Date(Date.now() - 25 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 years old
      };

      const result = registerSchema.safeParse(validAge);
      expect(result.success).toBe(true);
    });
  });

  describe('passwordResetSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'test@example.com' };
      
      const result = passwordResetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should transform email to lowercase and trim', () => {
      const data = { email: '  TEST@EXAMPLE.COM  ' };
      
      const result = passwordResetSchema.safeParse(data);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });

    it('should reject invalid email', () => {
      const invalidData = { email: 'invalid-email' };
      
      const result = passwordResetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = passwordResetSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    const validChangeData = {
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass123!',
      confirmNewPassword: 'NewPass123!',
    };

    it('should validate correct password change data', () => {
      const result = changePasswordSchema.safeParse(validChangeData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        ...validChangeData,
        confirmNewPassword: 'DifferentNewPass123!',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject same current and new password', () => {
      const invalidData = {
        currentPassword: 'SamePass123!',
        newPassword: 'SamePass123!',
        confirmNewPassword: 'SamePass123!',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak new password', () => {
      const invalidData = {
        ...validChangeData,
        newPassword: 'weakpass',
        confirmNewPassword: 'weakpass',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing current password', () => {
      const invalidData = {
        newPassword: 'NewPass123!',
        confirmNewPassword: 'NewPass123!',
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
