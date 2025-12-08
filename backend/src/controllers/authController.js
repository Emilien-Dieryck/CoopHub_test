import { login as loginService } from "../services/authService.js";
import logger from "../utils/logger.js";

/**
 * Authentication Controller
 * Handles user login requests and responses
 */

/**
 * Login handler - Authenticates user credentials and returns user information
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.identifier - User's email or username
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends JSON response with status 200 and user data on success
 * 
 * @example
 * POST /api/login
 * {
 *   "identifier": "john_doe",
 *   "password": "Emilien123"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Login successful",
 *   "user": {
 *     "id": 1,
 *     "username": "john_doe",
 *     "email": "john@example.com"
 *   }
 * }
 * 
 * @throws {BadRequestError} If identifier or password is missing
 * @throws {UnauthorizedError} If credentials are invalid
 */
export const login = (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    const user = loginService(identifier, password);
    logger.info(`User logged in: ${user.username} (${user.email})`);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};
