/**
 * Backend Server Entry Point
 * Initializes and starts the Express server
 */

import dotenv from "dotenv";

// Load environment variables from .env BEFORE importing app
dotenv.config();

import app from "./app.js";
import logger from "./utils/logger.js";

/**
 * Server port - defaults to 4000
 * Can be overridden via PORT environment variable
 * @type {number}
 */
const PORT = process.env.PORT || 4000;

/**
 * Start the server and listen for incoming requests
 */
app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`);
});
