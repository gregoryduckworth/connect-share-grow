
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validateWithSchema, validateEmail, validatePassword, sanitizeHtmlInput } from '../validationUtils'

describe('validationUtils', () => {
  describe('validateWithSchema', () => {
    it('should return success for valid data', () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const data = { name: 'John', age: 30 }
      
      const result = validateWithSchema(schema, data)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
    })

    it('should return errors for invalid data', () => {
      const schema = z.object({ name: z.string(), age: z.number() })
      const data = { name: 'John', age: 'invalid' }
      
      const result = validateWithSchema(schema, data)
      
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongP@ss1')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('sanitizeHtmlInput', () => {
    it('should sanitize HTML characters', () => {
      const input = '<script>alert("xss")</script>'
      const result = sanitizeHtmlInput(input)
      expect(result).not.toContain('<script>')
      expect(result).toContain('&lt;script&gt;')
    })
  })
})
