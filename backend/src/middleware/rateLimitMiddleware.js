/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and DoS
 * 
 * Two layers of protection:
 * 1. IP-based rate limiting (prevents request spam) - Applied globally BEFORE logging
 * 2. Identifier-based rate limiting (prevents credential stuffing) - Applied per-route
 */

import logger from '../utils/logger.js';

/**
 * In-memory store for rate limit tracking
 */
const loginAttempts = new Map(); // By identifier (failed logins)
const ipRequests = new Map();    // By IP (all requests)

const RATE_LIMIT_CONFIG = {
  // Failed login attempts per identifier
  MAX_FAILED_ATTEMPTS: 5,
  FAILED_WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  
  // Requests per IP (prevents spam)
  MAX_REQUESTS_PER_IP: 20,
  IP_WINDOW_MS: 60 * 1000, // 1 minute
};

/**
 * Gets client IP from request (supports proxies)
 */
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
    || req.socket?.remoteAddress 
    || 'unknown';
};

/**
 * Global Rate Limiter - Applied BEFORE logging to prevent log pollution
 * Only checks IP-based rate limiting, blocks silently after first warning
 */
export const globalRateLimiter = (req, res, next) => {
  const now = Date.now();
  const clientIP = getClientIP(req);
  
  const ipData = ipRequests.get(clientIP) || { 
    count: 0, 
    resetTime: now + RATE_LIMIT_CONFIG.IP_WINDOW_MS, 
    warned: false 
  };
  
  // Reset if window has passed
  if (now > ipData.resetTime) {
    ipData.count = 0;
    ipData.resetTime = now + RATE_LIMIT_CONFIG.IP_WINDOW_MS;
    ipData.warned = false;
  }
  
  ipData.count += 1;
  ipRequests.set(clientIP, ipData);
  
  // Check IP rate limit
  if (ipData.count > RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_IP) {
    // Log only once when limit is first exceeded
    if (!ipData.warned) {
      logger.warn(`Rate limit exceeded for IP: ${clientIP} - blocking further requests`);
      ipData.warned = true;
      ipRequests.set(clientIP, ipData);
    }
    // No logging for blocked requests - silent block
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil((ipData.resetTime - now) / 1000),
    });
  }
  
  // Log the request only if it passes rate limiting
  logger.info(`POST /api/login`);
  next();
};

/**
 * Rate limiting middleware for login endpoint
 * Checks identifier-based rate limiting (failed attempts)
 */
export const rateLimitMiddleware = (req, res, next) => {
  const now = Date.now();
  const identifier = req.body?.identifier;
  
  if (!identifier) {
    return next();
  }
  
  const attempts = loginAttempts.get(identifier) || { 
    attempts: 0, 
    resetTime: now + RATE_LIMIT_CONFIG.FAILED_WINDOW_MS 
  };
  
  // Reset if window has passed
  if (now > attempts.resetTime) {
    attempts.attempts = 0;
    attempts.resetTime = now + RATE_LIMIT_CONFIG.FAILED_WINDOW_MS;
  }
  
  // Check if failed attempts limit exceeded
  if (attempts.attempts >= RATE_LIMIT_CONFIG.MAX_FAILED_ATTEMPTS) {
    const resetDate = new Date(attempts.resetTime);
    return res.status(429).json({
      success: false,
      error: 'Too many failed login attempts. Please try again later.',
      retryAfter: Math.ceil((attempts.resetTime - now) / 1000),
      resetTime: resetDate.toISOString(),
    });
  }
  
  next();
};

/**
 * Records a failed login attempt
 * Should be called by controller when login fails
 * 
 * @param {string} identifier - Username or email that failed
 */
export const recordFailedAttempt = (identifier) => {
  if (!identifier) return;
  
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { 
    attempts: 0, 
    resetTime: now + RATE_LIMIT_CONFIG.FAILED_WINDOW_MS 
  };
  
  // Reset if window has passed
  if (now > attempts.resetTime) {
    attempts.attempts = 0;
    attempts.resetTime = now + RATE_LIMIT_CONFIG.FAILED_WINDOW_MS;
  }
  
  attempts.attempts += 1;
  loginAttempts.set(identifier, attempts);
};

/**
 * Clears login attempts for an identifier (on successful login)
 * 
 * @param {string} identifier - Username or email that successfully logged in
 */
export const clearLoginAttempts = (identifier) => {
  if (identifier) {
    loginAttempts.delete(identifier);
  }
};

