/**
 * Authentication Service
 * Business logic for user authentication with security measures
 * 
 * Features:
 * - Input validation and sanitization
 * - Password comparison using bcrypt (constant-time)
 * - JWT token generation
 * - No sensitive data in logs
 */

import { findByUsernameOrEmail } from "../repositories/userRepository.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/index.js";
import { 
  validateIdentifier, 
  validatePassword, 
  comparePasswords, 
  generateToken 
} from "../utils/securityUtils.js";
import { recordFailedAttempt, clearLoginAttempts } from "../middleware/rateLimitMiddleware.js";
import logger from "../utils/logger.js";

/**
 * Authenticates user with provided credentials
 * Implements security best practices:
 * - Input validation and sanitization
 * - Constant-time password comparison (bcrypt)
 * - Rate limiting (tracks failed attempts)
 * - JWT token generation
 * - No sensitive data logged
 *
 * @param {string} identifier - Username or email of the user (validated)
 * @param {string} password - User's password (validated, compared via bcrypt)
 * @returns {Object} Authentication result
 * @returns {string} returns.message - Success message
 * @returns {Object} returns.user - User data (id, username, email)
 * @returns {string} returns.token - JWT authentication token
 *
 * @throws {BadRequestError} If validation fails
 * @throws {UnauthorizedError} If authentication fails
 *
 * @example
 * const result = await login('john_doe', 'MyPassword123');
 * // Returns: { 
 * //   message: 'Login successful',
 * //   user: { id: 1, username: 'john_doe', email: 'john@example.com' },
 * //   token: 'eyJhbGciOiJIUzI1NiIs...'
 * // }
 */
export const login = async (identifier, password) => {
  let validatedIdentifier;
  let validatedPassword;

  // Validate inputs (may throw BadRequestError)
  try {
    validatedIdentifier = validateIdentifier(identifier);
    validatedPassword = validatePassword(password);
  } catch (error) {
    // Re-throw validation errors
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError(error.message);
  }

  try {
    // Find user in database
    const user = findByUsernameOrEmail(validatedIdentifier);

    if (!user) {
      recordFailedAttempt(validatedIdentifier);
      throw new UnauthorizedError("Invalid credentials");
    }

    // Compare password using bcrypt (constant-time comparison)
    const passwordMatch = await comparePasswords(validatedPassword, user.password);

    if (!passwordMatch) {
      recordFailedAttempt(validatedIdentifier);
      throw new UnauthorizedError("Invalid credentials");
    }

    // Clear failed login attempts on successful login
    clearLoginAttempts(validatedIdentifier);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Return sanitized user data and token
    return {
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    // Re-throw expected errors
    if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
      throw error;
    }

    // Wrap unexpected errors (log server-side only)
    logger.error(`Unexpected login error: ${error.message}`);
    throw new UnauthorizedError("Authentication failed");
  }
};
