/**
 * Application Logger Utility
 * Provides logging functionality using Winston library
 * Logs to both console and file (logs/backend.log)
 */

import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

/**
 * Directory path for log files
 * @type {string}
 */
const logsDir = path.join(process.cwd(), "logs");

/**
 * Create logs directory if it doesn't exist
 */
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * Full path to the log file
 * @type {string}
 */
const logPath = path.join(process.cwd(), "logs", "backend.log");

/**
 * Winston logger instance
 * Combines console and file transports with timestamp formatting
 * @type {import('winston').Logger}
 */
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logPath })
  ],
});

/**
 * Export logger instance for use throughout the application
 * 
 * @example
 * import logger from './utils/logger.js';
 * logger.info('User logged in successfully');
 * logger.error('Database connection failed');
 */
export default logger;
