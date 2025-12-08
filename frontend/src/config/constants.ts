/**
 * Application Constants
 * Centralized configuration for security, API, and validation settings
 */

/**
 * API Configuration
 * Base URL is read from environment variable for security and flexibility
 */
export const API_CONFIG = {
  BASE_URL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    LOGIN: '/login',
    LOGOUT: '/logout',
  },
} as const;

/**
 * Local Storage Keys
 * Using environment variables to prevent hardcoded keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: (import.meta as any).env.VITE_TOKEN_STORAGE_KEY || 'authToken',
  USER_DATA: (import.meta as any).env.VITE_USER_STORAGE_KEY || 'userData',
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
 */
export const SECURITY_CONFIG = {
  // Maximum login attempts before temporary lockout
  MAX_LOGIN_ATTEMPTS: 5,
  // Lockout duration in milliseconds (5 minutes)
  LOCKOUT_DURATION: 5 * 60 * 1000,
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
  TOO_MANY_ATTEMPTS: 'Trop de tentatives. Veuillez réessayer plus tard.',
} as const;
