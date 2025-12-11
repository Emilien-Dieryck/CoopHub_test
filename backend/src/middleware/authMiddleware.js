/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import { verifyToken } from '../utils/securityUtils.js';
import { UnauthorizedError } from '../exceptions/index.js';

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to request object
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * 
 * @throws {UnauthorizedError} If token is missing, invalid, or expired
 * 
 * @example
 * app.get('/protected', authMiddleware, (req, res) => {
 *   // req.user contains decoded token data
 *   res.json({ userId: req.user.id });
 * });
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }
    
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
    
    // Verify token and get payload
    const decoded = verifyToken(token);
    
    // Attach user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    // Pass all errors to errorHandler middleware
    next(error);
  }
};
