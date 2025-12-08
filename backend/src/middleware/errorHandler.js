/**
 * Global Error Handler Middleware
 * Catches errors from routes and other middleware, formats error responses
 * Must be the last middleware defined in the application
 */

import logger from "../utils/logger.js";

/**
 * Express error handling middleware
 * Processes thrown errors and returns appropriate HTTP responses
 *
 * @param {Error} err - Error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void} Sends JSON error response to client
 *
 * @example
 * // In route handler
 * app.use(errorHandler); // Must be defined last
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error(`${req.method} ${req.originalUrl} - ${status} - ${message}`);

  res.status(status).json({ error: message });
};
