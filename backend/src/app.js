/**
 * Express Application Configuration
 * Main application setup with middleware, security, and route configuration
 * 
 * NOTE: Environment variables must be loaded BEFORE this module is imported
 * (done in server.js with dotenv.config())
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

/**
 * Security Middleware Stack
 */

/**
 * CORS Configuration
 * Limits requests to frontend origin only
 */
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/**
 * Security Headers Middleware
 * Prevents common vulnerabilities
 */
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Strict Transport Security (HTTPS only in production)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  
  next();
});

/**
 * JSON Parser Middleware - Parses incoming request bodies as JSON
 * Limits to prevent large payload attacks
 */
app.use(express.json({ limit: "1mb" }));

/**
 * Request Logging Middleware
 * Logs non-login requests (login logging is handled in rate limiter)
 */
app.use((req, res, next) => {
  // Skip /api/login - logging is done in globalRateLimiter
  if (!req.path.includes('/login')) {
    logger.info(`${req.method} ${req.originalUrl}`);
  }
  next();
});

/**
 * Authentication Routes - Handles all auth-related endpoints
 * Prefix: /api
 * Note: Rate limiting is applied per-route in authRoutes.js
 */
app.use("/api", authRoutes);

/**
 * Health Check Endpoint
 * Used to verify server is running
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * 404 Handler
 * Catches unmatched routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

/**
 * Global Error Handler Middleware
 * Must be the last middleware defined
 */
app.use(errorHandler);

export default app;
