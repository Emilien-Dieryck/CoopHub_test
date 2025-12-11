/**
 * TypeScript Type Definitions
 * Centralized type definitions for the CoopHub application
 * Ensures type safety across components, API calls, and state management
 */

/**
 * User login credentials
 * Can use either username or email as identifier
 */
export interface LoginCredentials extends Record<string, string> {
  /** Username or email address */
  identifier: string;
  /** User password (plain text, hashed by backend) */
  password: string;
}

/**
 * API response for successful login
 */
export interface LoginResponse {
  /** Whether login was successful */
  success: boolean;
  /** Success or error message from server */
  message: string;
  /** User information (if login successful) */
  user?: {
    /** User's unique username */
    username: string;
    /** User's email address */
    email: string;
  };
  /** JWT or session token (if login successful) */
  token?: string;
}

/**
 * API error structure
 * Used for consistent error handling across the application
 */
export interface ApiError {
  /** Error message to display to user */
  message: string;
  /** HTTP status code (if available) */
  status?: number;
}

/**
 * Form validation errors
 * Maps field names to error messages
 */
export interface FormErrors {
  /** Error for identifier field (username/email) */
  identifier?: string;
  /** Error for password field */
  password?: string;
  /** General form error (not specific to a field) */
  general?: string;
}

/**
 * Input component props
 * Props for the reusable Input component
 * Includes all properties needed for an accessible form input
 */
export interface InputProps {
  /** Unique HTML id for the input */
  id: string;
  /** Form field name */
  name: string;
  /** Input type (text, password, email, etc.) */
  type: string;
  /** Label text to display above input */
  label: string;
  /** Current input value */
  value: string;
  /** Change handler function */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message to display (if any) */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Whether field is required */
  required?: boolean;
  /** Autocomplete attribute value */
  autoComplete?: string;
}
