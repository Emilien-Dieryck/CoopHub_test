/**
 * Validation Utilities
 * Security-focused input validation and sanitization
 */

import { VALIDATION_RULES, ERROR_MESSAGES, SECURITY_CONFIG } from '../config/constants';

/**
 * Sanitizes user input by removing potentially dangerous characters
 * Prevents XSS attacks by blocking script injection attempts
 * 
 * @param input - Raw user input string
 * @returns Sanitized string with dangerous characters removed
 * 
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // Returns: 'scriptalert("xss")/script'
 * sanitizeInput('john_doe@example.com') // Returns: 'john_doe@example.com'
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous patterns
  return input
    .replace(SECURITY_CONFIG.FORBIDDEN_CHARS, '')
    .trim();
};

/**
 * Validates identifier field (username or email)
 * Checks for required field, length constraints, and allowed characters
 * 
 * @param identifier - Username or email to validate
 * @returns Error message if invalid, undefined if valid
 * 
 * @example
 * validateIdentifier('') // Returns: 'Ce champ est requis.'
 * validateIdentifier('ab') // Returns: 'Minimum 3 caractères requis.'
 * validateIdentifier('john_doe') // Returns: undefined
 */
export const validateIdentifier = (identifier: string): string | undefined => {
  const sanitized = sanitizeInput(identifier);
  
  if (!sanitized) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  // Additional security check: detect malicious patterns
  if (containsMaliciousContent(sanitized)) {
    return ERROR_MESSAGES.INVALID_CHARACTERS;
  }
  
  if (sanitized.length < VALIDATION_RULES.IDENTIFIER.MIN_LENGTH) {
    return ERROR_MESSAGES.TOO_SHORT(VALIDATION_RULES.IDENTIFIER.MIN_LENGTH);
  }
  
  if (sanitized.length > VALIDATION_RULES.IDENTIFIER.MAX_LENGTH) {
    return ERROR_MESSAGES.TOO_LONG(VALIDATION_RULES.IDENTIFIER.MAX_LENGTH);
  }
  
  if (!VALIDATION_RULES.IDENTIFIER.PATTERN.test(sanitized)) {
    return ERROR_MESSAGES.INVALID_CHARACTERS;
  }
  
  return undefined;
};

/**
 * Validates password field
 * Checks for required field and length constraints
 * Note: Does not check complexity to avoid user frustration (handled server-side)
 * 
 * @param password - Password to validate
 * @returns Error message if invalid, undefined if valid
 * 
 * @example
 * validatePassword('') // Returns: 'Ce champ est requis.'
 * validatePassword('123') // Returns: 'Minimum 4 caractères requis.'
 * validatePassword('MySecurePass123') // Returns: undefined
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return ERROR_MESSAGES.REQUIRED_FIELD;
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return ERROR_MESSAGES.TOO_SHORT(VALIDATION_RULES.PASSWORD.MIN_LENGTH);
  }
  
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return ERROR_MESSAGES.TOO_LONG(VALIDATION_RULES.PASSWORD.MAX_LENGTH);
  }
  
  return undefined;
};

/**
 * Checks if input contains potentially dangerous content
 * Additional security layer to detect malicious patterns
 * 
 * @param input - String to check for malicious content
 * @returns True if dangerous content detected, false otherwise
 */
const containsMaliciousContent = (input: string): boolean => {
  if (!input) return false;
  return SECURITY_CONFIG.FORBIDDEN_CHARS.test(input);
};
