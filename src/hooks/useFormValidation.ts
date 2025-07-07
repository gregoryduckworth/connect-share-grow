
import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';
import { validateWithSchema, ValidationResult } from '@/lib/validation/validationUtils';
import { logger } from '@/lib/logging/logger';

interface UseFormValidationOptions<T> {
  schema: ZodSchema<T>;
  onValidSubmit?: (data: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onValidSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: any) => {
    try {
      // Validate single field
      const fieldSchema = schema.shape[name as string];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
        return true;
      }
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Invalid value';
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
      return false;
    }
    return true;
  }, [schema]);

  const validateAll = useCallback((): ValidationResult<T> => {
    const result = validateWithSchema(schema, values);
    
    if (!result.success && result.errors) {
      const errorMap: Record<string, string> = {};
      result.errors.forEach(error => {
        // Simple error mapping - in production, you'd want more sophisticated parsing
        const field = Object.keys(values)[0]; // Simplified
        errorMap[field] = error;
      });
      setErrors(errorMap);
    } else {
      setErrors({});
    }
    
    return result;
  }, [schema, values]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange && touched[name as string]) {
      validateField(name, value);
    }
  }, [validateOnChange, touched, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validateOnBlur) {
      validateField(name, values[name]);
    }
  }, [validateOnBlur, validateField, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setIsSubmitting(true);
    logger.info('Form submission started');
    
    try {
      const result = validateAll();
      
      if (result.success && result.data && onValidSubmit) {
        await onValidSubmit(result.data);
        logger.info('Form submitted successfully');
      } else {
        logger.warn('Form validation failed', { errors: result.errors });
      }
    } catch (error) {
      logger.error('Form submission error', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, onValidSubmit]);

  const reset = useCallback(() => {
    setValues({});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}
