/**
 * #12: Form Handling Hook
 * 
 * 提取重复的表单处理逻辑，支持多种表单类型
 */

import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  isValid: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  onSuccess,
  onError,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());

  const handleChange = useCallback((field: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : e.target.value;
      
      setValuesState(prev => ({ ...prev, [field]: value }));
      
      // Clear error when field is modified
      if (errors[field]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
  [errors]);

  const handleBlur = useCallback((field: keyof T) => 
    () => {
      setTouched(prev => new Set(prev).add(field));
      
      // Validate on blur if validator provided
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors[field]) {
          setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
        }
      }
    },
  [validate, values]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, onSuccess, onError]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const resetForm = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched(new Set());
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
    isValid,
  };
}

/**
 * Password validation helper
 */
export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  return undefined;
}

/**
 * Email validation helper
 */
export function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return undefined;
}

/**
 * Required field validation helper
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return undefined;
}