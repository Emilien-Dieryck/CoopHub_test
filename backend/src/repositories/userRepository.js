/**
 * User Repository
 * Data access layer for user-related database operations
 */

import { usersData } from "../data/users.js";

/**
 * Finds a user by username or email address
 * Searches the user database for a matching username or email
 *
 * @param {string} identifier - Username or email to search for
 * @returns {Object|undefined} User object if found, undefined otherwise
 * @returns {number} returns.id - User's unique identifier
 * @returns {string} returns.username - User's username
 * @returns {string} returns.email - User's email address
 * @returns {string} returns.password - User's hashed password
 *
 * @example
 * const user = findByUsernameOrEmail('john_doe');
 * // Returns: { id: 1, username: 'john_doe', email: 'john@example.com', password: '$2b$10$...' }
 *
 * @example
 * const userByEmail = findByUsernameOrEmail('john@example.com');
 * // Returns: { id: 1, username: 'john_doe', email: 'john@example.com', password: '$2b$10$...' }
 */
export const findByUsernameOrEmail = (identifier) => {
  return usersData.find(u => u.username === identifier || u.email === identifier);
};
