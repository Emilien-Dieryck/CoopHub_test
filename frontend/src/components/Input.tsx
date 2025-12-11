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
 * - Password visibility toggle
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

import React, { useState } from 'react';
import { InputProps } from '../types/types';
import '../styles/Input.scss';

/**
 * Eye icon for showing password
 */
const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * Eye-off icon for hiding password
 */
const EyeOffIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

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
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="input-group">
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      
      <div className={`input-wrapper ${isPasswordField ? 'has-toggle' : ''}`}>
        <input
          id={id}
          name={name}
          type={inputType}
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
        
        {isPasswordField && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      
      {error && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
