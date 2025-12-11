/**
 * Global Error Handler Middleware
 * Catches errors from routes and other middleware, formats error responses
 * Handles different error types securely (no sensitive data exposure)
 * Must be the last middleware defined in the application
 */

import logger from "../utils/logger.js";
import { BadRequestError, UnauthorizedError } from "../exceptions/index.js";

/**
 * Express error handling middleware
 * Processes thrown errors and returns appropriate HTTP responses
 * Prevents sensitive information from leaking to clients
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Sends JSON error response to client
 * 
 * Error handling:
 * - BadRequestError (400): Validation/input errors
 * - UnauthorizedError (401): Authentication failures
 * - SyntaxError (400): JSON parsing errors
 * - Default (500): Server errors (no details leaked to client)
 *
 * @example
 * // In route handler
 * app.use(errorHandler); // Must be defined last
 */
export const errorHandler = (err, req, res, next) => {
  // Default error response
  let status = 500;
  let message = "Internal server error";
  let details = undefined;

  // Log full error (server-side only)
  logger.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    {
      status: err.statusCode || 500,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    }
  );

  // Handle custom application errors
  if (err instanceof BadRequestError) {
    status = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    status = 401;
    message = err.message;
  } else if (err instanceof SyntaxError) {
    // JSON parsing error
    status = 400;
    message = "Invalid JSON in request body";
  } else if (err.name === "JsonWebTokenError") {
    // Invalid JWT token
    status = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    // Expired JWT token
    status = 401;
    message = "Token has expired";
  } else {
    // Generic server error (don't expose details to client)
    status = err.statusCode || 500;
    if (process.env.NODE_ENV === "development") {
      message = err.message;
    }
  }

  // Return error response
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && details && { details }),
  });
};
