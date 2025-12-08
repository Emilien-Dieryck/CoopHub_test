/**
 * useForm Hook
 * Custom React hook for form state management with validation
 * 
 * Features:
 * - Type-safe form state management
 * - Built-in validation with custom validators
 * - Error handling and display
 * - Submission state tracking
 * - Form reset capability
 */

import { useState, ChangeEvent, FormEvent } from 'react';
import { FormErrors } from '../types';
import { validateIdentifier, validatePassword } from '../utils/validation';

/**
 * Return type for useForm hook
 * @template T - Form values type (must extend Record<string, string>)
 */
interface UseFormReturn<T> {
  /** Current form field values */
  values: T;
  /** Validation errors by field name */
  errors: FormErrors;
  /** True when form is being submitted */
  isSubmitting: boolean;
  /** Handler for input change events */
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Form submission handler with validation */
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
  /** Manually set form errors */
  setErrors: (errors: FormErrors) => void;
  /** Reset form to initial state */
  resetForm: () => void;
  /** Manually trigger validation */
  validateForm: () => boolean;
}

/**
 * Custom form hook with built-in validation and security
 * 
 * @template T - Type of form values object
 * @param initialValues - Initial form field values
 * @returns Form state and handlers
 * 
 * @example
 * const form = useForm<LoginCredentials>({
 *   identifier: '',
 *   password: ''
 * });
 */
export const useForm = <T extends Record<string, string>>(
  initialValues: T
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles input field changes
   * - Updates field value
   * - Clears field-specific error
   * - Clears general error message
   * 
   * @param e - Change event from input element
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update field value
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear general error
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: undefined
      }));
    }
  };

  /**
   * Validates all form fields using security-focused validators
   * - Uses centralized validation utilities
   * - Checks for malicious input patterns
   * - Enforces length and format constraints
   * 
   * @returns True if all fields are valid, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate identifier field (username or email)
    if ('identifier' in values) {
      const identifierError = validateIdentifier(values.identifier);
      if (identifierError) {
        newErrors.identifier = identifierError;
      }
    }
    
    // Validate password field
    if ('password' in values) {
      const passwordError = validatePassword(values.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Creates form submission handler with validation
   * - Prevents default form submission
   * - Validates all fields before submission
   * - Manages submission state
   * - Handles errors from submission callback
   * 
   * @param onSubmit - Async callback to execute on valid submission
   * @returns Form event handler
   */
  const handleSubmit = (onSubmit: (values: T) => Promise<void>) => {
    return async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Validate all fields before submission
      if (!validate()) {
        return;
      }
      
      setIsSubmitting(true);
      setErrors({});
      
      try {
        await onSubmit(values);
      } catch (error: any) {
        // Handle backend errors
        const errorMessage = error.message || 'Une erreur est survenue';
        setErrors({ general: errorMessage });
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  /**
   * Resets form to initial state
   * Clears all values, errors, and submission state
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
    validateForm: validate,
  };
};
