
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'
import { useFormValidation } from '../useFormValidation'

const mockSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

describe('useFormValidation', () => {
  it('should initialize with empty values', () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema: mockSchema })
    )

    expect(result.current.values).toEqual({})
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should handle value changes', () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema: mockSchema })
    )

    act(() => {
      result.current.handleChange('name', 'John Doe')
    })

    expect(result.current.values.name).toBe('John Doe')
  })

  it('should validate on blur when enabled', () => {
    const { result } = renderHook(() =>
      useFormValidation({ 
        schema: mockSchema,
        validateOnBlur: true 
      })
    )

    act(() => {
      result.current.handleChange('email', 'invalid-email')
      result.current.handleBlur('email')
    })

    expect(result.current.errors.email).toBeDefined()
  })

  it('should reset form state', () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema: mockSchema })
    )

    act(() => {
      result.current.handleChange('name', 'John')
      result.current.reset()
    })

    expect(result.current.values).toEqual({})
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })
})
