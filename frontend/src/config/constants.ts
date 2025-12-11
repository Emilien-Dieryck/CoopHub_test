/**
 * Application Constants
 * Centralized configuration for security, API, and validation settings
 */

// ============================================
// Environment Variables
// ============================================
const getEnvVar = (key: string, fallback: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return (value as string) || fallback;
};

const API_BASE_URL = getEnvVar(
  'VITE_API_BASE_URL',
  'http://localhost:4000/api'
);

const TOKEN_STORAGE_KEY = getEnvVar(
  'VITE_TOKEN_STORAGE_KEY',
  'coophub_auth_token'
);

const USER_STORAGE_KEY = getEnvVar(
  'VITE_USER_STORAGE_KEY',
  'coophub_user_data'
);

// ============================================
// API Configuration
// ============================================
/**
 * API Configuration
 * Centralized API settings with security measures
 */
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds (prevents slowloris attacks)
  ENDPOINTS: {
    LOGIN: '/login',
    LOGOUT: '/logout',
  },
} as const;

// ============================================
// Storage Configuration
// ============================================
/**
 * Local Storage Keys
 * Centralized storage keys for type safety and consistency
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: TOKEN_STORAGE_KEY,
  USER_DATA: USER_STORAGE_KEY,
} as const;

/**
 * Form Validation Rules
 * Centralized validation constants for consistency
 */
export const VALIDATION_RULES = {
  IDENTIFIER: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9._@-]+$/, // Alphanumeric + email-safe chars only
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 128,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

/**
 * Security Configuration
 * XSS prevention patterns for client-side validation
 */
export const SECURITY_CONFIG = {
  // Characters not allowed in user input (XSS prevention)
  FORBIDDEN_CHARS: /<|>|&lt;|&gt;|javascript:|onerror=|onclick=/gi,
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Error Messages
 * Centralized error messages for consistency
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Impossible de se connecter au serveur. Vérifiez votre connexion.',
  INVALID_CREDENTIALS: 'Identifiant ou mot de passe incorrect.',
  REQUIRED_FIELD: 'Ce champ est requis.',
  INVALID_FORMAT: 'Format invalide.',
  TOO_SHORT: (min: number) => `Minimum ${min} caractères requis.`,
  TOO_LONG: (max: number) => `Maximum ${max} caractères autorisés.`,
  INVALID_CHARACTERS: 'Caractères invalides détectés.',
} as const;
