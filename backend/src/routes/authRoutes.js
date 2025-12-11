/**
 * Authentication Routes
 * Defines all authentication-related endpoints with security middleware
 * 
 * Features:
 * - Rate limiting (prevents brute force)
 * - Input validation (server-side)
 * - JWT token generation
 * - Secure error handling
 */

import express from "express";
import { login } from "../controllers/authController.js";
import { globalRateLimiter, rateLimitMiddleware } from "../middleware/rateLimitMiddleware.js";

/**
 * Express Router instance for authentication routes
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * POST /api/auth/login
 * User login endpoint with security measures
 * 
 * Middleware:
 * - rateLimitMiddleware: Limits attempts (5 per 5 minutes per identifier)
 * 
 * Request body:
 * {
 *   "identifier": "username or email",
 *   "password": "password"
 * }
 * 
 * Success response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "user": { "id": 1, "username": "john_doe", "email": "john@example.com" },
 *   "token": "eyJhbGciOiJIUzI1NiIs..."
 * }
 * 
 * Error responses:
 * - 400 Bad Request: Validation error
 * - 401 Unauthorized: Invalid credentials
 * - 429 Too Many Requests: Rate limited
 * 
 * @route POST /auth/login
 * @see authController.login for implementation details
 */
// Expose a simple, legacy-friendly endpoint: POST /api/login
// globalRateLimiter: blocks spam (20 req/min per IP) - logs only once when exceeded
// rateLimitMiddleware: blocks brute force (5 failed attempts per identifier)
router.post("/login", globalRateLimiter, rateLimitMiddleware, login);
export default router;
