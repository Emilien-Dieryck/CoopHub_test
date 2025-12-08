/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

import express from "express";
import { login } from "../controllers/authController.js";

/**
 * Express Router instance for authentication routes
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * POST /api/login
 * User login endpoint
 * Authenticates user with username/email and password
 * @route POST /login
 * @see authController.login for implementation details
 */
router.post("/login", login);

export default router;
