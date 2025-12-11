import { login as loginService } from "../services/authService.js";
import logger from "../utils/logger.js";

/**
 * Authentication Controller
 * Handles user login requests with security measures
 * 
 * Features:
 * - JWT token generation
 * - Rate limiting (via middleware)
 * - Structured error responses
 * - Security logging (no sensitive data)
 */

/**
 * Login handler - Authenticates user credentials and returns JWT token
 * 
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.identifier - User's email or username
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Sends JSON response with JWT token on success
 * 
 * Success response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "user": {
 *     "id": 1,
 *     "username": "john_doe",
 *     "email": "john@example.com"
 *   },
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * Error responses:
 * - 400 Bad Request: Invalid input data
 * - 401 Unauthorized: Invalid credentials
 * - 429 Too Many Requests: Rate limited (too many failed attempts)
 * 
 * @example
 * POST /api/auth/login
 * {
 *   "identifier": "john_doe",
 *   "password": "MySecurePassword123"
 * }
 * 
 * @throws {BadRequestError} If input validation fails
 * @throws {UnauthorizedError} If credentials are invalid
 */
export const login = async (req, res, next) => {
  const { identifier, password } = req.body;
  try {
    // Log received fields (non-sensitive)
    logger.info(`Login request received for identifier=${String(identifier)}`);

    const result = await loginService(identifier, password);
    
    // Log successful login (no sensitive data)
    logger.info(`User logged in: ${result.user.username}`);
    
    // Return successful response with JWT token
    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    // Log error and pass to error handler middleware
    logger.error(`Login failed: ${err.message}`);
    next(err);
  }
};
