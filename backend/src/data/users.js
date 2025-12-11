/**
 * Mock User Database
 * Centralized storage for user data
 * 
 * IMPORTANT: 
 * - In production, use a real database (MongoDB, PostgreSQL, etc.)
 * - Passwords are stored as bcrypt hashes (never plaintext)
 * - To update passwords, use hashPassword() utility
 * 
 * Current passwords are bcrypt hashes for:
 * - john_doe: "john123" (hashed)
 * - jane_smith: "abcde123" (hashed)
 */

/**
 * Array of user objects with hashed passwords
 * @type {Array<Object>}
 * @property {number} id - Unique user identifier
 * @property {string} username - User's unique username
 * @property {string} email - User's email address
 * @property {string} password - User's password (bcrypt hash, never plaintext)
 */
export const usersData = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    // Password: "john123" (bcrypt hash with 10 rounds)
    password: "$2b$10$/abf7yy0Yl38cwy4iq/miuWXVf2B6aIwnfppzUaJ9.1dVnuwkWmWC",
  },
  {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    // Password: "abcde123" (bcrypt hash with 10 rounds)
    password: "$2b$10$znPyWV6KOF2osRbuhiHhou9gdk7ZXnwhim7vsQu5q1EAa1/1T1Yk6",
  },
];

