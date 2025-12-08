/**
 * Authentication Service
 * Business logic for user authentication
 */

import { findByUsernameOrEmail } from "../repositories/userRepository.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/index.js";

/**
 * Authenticates user with provided credentials
 * Validates identifier and password, then verifies against stored user data
 *
 * @param {string} identifier - Username or email of the user
 * @param {string} password - User's password (plain text for mock, should be hashed in production)
 * @returns {Object} Authenticated user object with sanitized data
 * @returns {number} returns.id - User's unique identifier
 * @returns {string} returns.username - User's username
 * @returns {string} returns.email - User's email address
 *
 * @throws {BadRequestError} If identifier or password is missing or empty
 * @throws {UnauthorizedError} If user not found or password is incorrect
 *
 * @example
 * const user = login('john_doe', 'Emilien123');
 * // Returns: { id: 1, username: 'john_doe', email: 'john@example.com' }
 */
export const login = (identifier, password) => {
  if (!identifier || !password) {
    throw new BadRequestError("Identifier and password are required");
  }

  const user = findByUsernameOrEmail(identifier);

  if (!user || user.password !== password) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return { id: user.id, username: user.username, email: user.email };
};
