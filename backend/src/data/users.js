/**
 * Mock User Database
 * Centralized storage for user data
 * 
 * NOTE: This is a mock implementation for development.
 * In production, use a real database (MongoDB, PostgreSQL, etc.)
 * and implement proper password hashing (bcrypt, argon2, etc.)
 */

/**
 * Array of user objects
 * @type {Array<Object>}
 * @property {number} id - Unique user identifier
 * @property {string} username - User's unique username
 * @property {string} email - User's email address
 * @property {string} password - User's password (plain text in mock, hashed in production)
 */
export const usersData = [
  { id: 1, username: "john_doe", email: "john@example.com", password: "john123" },
  { id: 2, username: "jane_smith", email: "jane@example.com", password: "abcde123" },
];
