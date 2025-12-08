/**
 * Express Application Configuration
 * Main application setup with middleware and route configuration
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

/**
 * CORS Middleware - Enables cross-origin requests
 */
app.use(cors());

/**
 * JSON Parser Middleware - Parses incoming request bodies as JSON
 */
app.use(express.json());

/**
 * Authentication Routes - Handles all auth-related endpoints
 * Prefix: /api
 */
app.use("/api", authRoutes);

/**
 * Global Error Handler Middleware
 * Must be the last middleware defined
 */
app.use(errorHandler);

export default app;
