import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  logger.error(`${req.method} ${req.originalUrl} - ${status} - ${message}`);

  res.status(status).json({ error: message });
};
