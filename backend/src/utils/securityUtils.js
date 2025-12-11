/**
 * Security Utilities
 * Password hashing, JWT token generation, input validation
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hashes a plain text password using bcrypt
 * 
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 */
export const hashPassword = async (password) => {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '10');
  return bcrypt.hash(password, rounds);
};

/**
 * Compares plain text password with hashed password
 * 
 * @param {string} plainPassword - Plain text password from user
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 * 
 * @example
 * const isMatch = await comparePasswords('myPassword123', hashedPasswordFromDb);
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generates JWT authentication token
 * 
 * @param {Object} payload - Data to encode in token
 * @param {number} payload.id - User ID
 * @param {string} payload.username - Username
 * @param {string} payload.email - User email
 * @returns {string} JWT token
 * 
 * @example
 * const token = generateToken({ id: 1, username: 'john_doe', email: 'john@example.com' });
 */
export const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiration = process.env.JWT_EXPIRATION || '24h';
  
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  return jwt.sign(payload, secret, { expiresIn: expiration });
};

/**
 * Verifies and decodes JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 * 
 * @example
 * const payload = verifyToken(token);
 * console.log(payload.username);
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  return jwt.verify(token, secret);
};

/**
 * Validates input is not empty and is a string
 * 
 * @param {string} input - Input to validate
 * @param {string} fieldName - Name of field (for error messages)
 * @returns {string} Trimmed input
 * @throws {Error} If input is invalid
 * 
 * @example
 * const username = validateInput(req.body.username, 'username');
 */
export const validateInput = (input, fieldName = 'input') => {
  if (!input || typeof input !== 'string') {
    throw new Error(`${fieldName} is required and must be a string`);
  }
  
  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  return trimmed;
};

/**
 * Validates identifier (username or email) format
 * 
 * @param {string} identifier - Username or email to validate
 * @returns {string} Validated identifier
 * @throws {Error} If identifier format is invalid
 * 
 * @example
 * const identifier = validateIdentifier('john_doe');
 */
export const validateIdentifier = (identifier) => {
  const validated = validateInput(identifier, 'identifier');
  
  // Allow usernames and emails: 3-50 chars, alphanumeric + ._@-
  const identifierPattern = /^[a-zA-Z0-9._@-]{3,50}$/;
  
  if (!identifierPattern.test(validated)) {
    throw new Error('Invalid identifier format');
  }
  
  return validated;
};

/**
 * Validates password meets minimum requirements
 * 
 * @param {string} password - Password to validate
 * @returns {string} Validated password
 * @throws {Error} If password is invalid
 * 
 * @example
 * const password = validatePassword('MySecurePass123');
 */
export const validatePassword = (password) => {
  const validated = validateInput(password, 'password');
  
  // Minimum 4 chars, maximum 128 chars
  if (validated.length < 4 || validated.length > 128) {
    throw new Error('Password must be between 4 and 128 characters');
  }
  
  return validated;
};
