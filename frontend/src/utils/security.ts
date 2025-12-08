/**
 * Security Utilities
 * Rate limiting, XSS protection, and security helpers
 */

import { SECURITY_CONFIG } from '../config/constants';

/**
 * Login attempt tracking for rate limiting
 */
interface LoginAttempt {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

// In-memory storage for login attempts (per session)
const loginAttempts = new Map<string, LoginAttempt>();

/**
 * Escapes HTML special characters to prevent XSS attacks
 * Should be used when displaying user-generated content
 * 
 * @param unsafe - Potentially unsafe string
 * @returns HTML-safe string
 * 
 * @example
 * escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Checks if user has exceeded maximum login attempts
 * Implements temporary lockout after too many failed attempts
 * 
 * @param identifier - Username or email attempting to login
 * @returns Object with isLocked status and optional lockout time remaining
 * 
 * @example
 * const { isLocked, remainingTime } = checkLoginAttempts('john_doe')
 * if (isLocked) {
 *   console.log(`Locked for ${remainingTime}ms`)
 * }
 */
export const checkLoginAttempts = (identifier: string): { 
  isLocked: boolean; 
  remainingTime?: number 
} => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt) {
    return { isLocked: false };
  }
  
  // Check if lockout period has expired
  if (attempt.lockedUntil && attempt.lockedUntil > now) {
    return { 
      isLocked: true, 
      remainingTime: attempt.lockedUntil - now 
    };
  }
  
  // Reset if lockout expired
  if (attempt.lockedUntil && attempt.lockedUntil <= now) {
    loginAttempts.delete(identifier);
    return { isLocked: false };
  }
  
  // Check if within attempt limit
  if (attempt.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    // Apply lockout
    attempt.lockedUntil = now + SECURITY_CONFIG.LOCKOUT_DURATION;
    return { 
      isLocked: true, 
      remainingTime: SECURITY_CONFIG.LOCKOUT_DURATION 
    };
  }
  
  return { isLocked: false };
};

/**
 * Records a failed login attempt
 * Used for rate limiting and security monitoring
 * 
 * @param identifier - Username or email that failed login
 * 
 * @example
 * recordFailedAttempt('john_doe')
 */
export const recordFailedAttempt = (identifier: string): void => {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);
  
  if (!attempt) {
    loginAttempts.set(identifier, {
      count: 1,
      firstAttempt: now,
    });
  } else {
    attempt.count++;
  }
};

/**
 * Clears failed login attempts for a user
 * Called after successful login
 * 
 * @param identifier - Username or email to clear attempts for
 * 
 * @example
 * clearLoginAttempts('john_doe')
 */
export const clearLoginAttempts = (identifier: string): void => {
  loginAttempts.delete(identifier);
};

/**
 * Generates a secure random string (client-side nonce/state)
 * Useful for CSRF protection or generating unique IDs
 * 
 * @param length - Length of random string (default: 32)
 * @returns Random alphanumeric string
 * 
 * @example
 * const nonce = generateRandomString(16) // Returns: 'a3f9d2c1e5b8...'
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
};

/**
 * Formats lockout time for user-friendly display
 * 
 * @param milliseconds - Remaining lockout time in ms
 * @returns Human-readable time string
 * 
 * @example
 * formatLockoutTime(125000) // Returns: '2 minutes 5 secondes'
 */
export const formatLockoutTime = (milliseconds: number): string => {
  const seconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} seconde${remainingSeconds > 1 ? 's' : ''}`;
  }
  
  return `${seconds} seconde${seconds > 1 ? 's' : ''}`;
};
