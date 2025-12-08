/**
 * Input Component
 * Accessible, reusable form input with error display
 * 
 * Features:
 * - ARIA attributes for accessibility
 * - Error state management
 * - Required field indicator
 * - Disabled state support
 * - AutoComplete support
 * 
 * @example
 * <Input
 *   id="email"
 *   name="email"
 *   type="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={handleChange}
 *   error={errors.email}
 *   required
 * />
 */

import React from 'react';
import { InputProps } from '../types';
import '../styles/Input.scss';

/**
 * Input component with built-in label, error display, and accessibility
 * 
 * @param props - Input component properties
 * @returns Accessible input field with label and error display
 */
const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  required = false,
  autoComplete
}) => {
  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      
      {error && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
