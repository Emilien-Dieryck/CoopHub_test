/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and DoS
 */

/**
 * In-memory store for rate limit tracking
 * Structure: { "identifier": { attempts: number, resetTime: number } }
 */
const loginAttempts = new Map();

const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 5 * 60 * 1000, // 5 minutes
};

/**
 * Rate limiting middleware for login endpoint
 * Limits failed login attempts to prevent brute force
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * 
 * @example
 * app.post('/auth/login', rateLimitMiddleware, loginController);
 */
export const rateLimitMiddleware = (req, res, next) => {
  const identifier = req.body?.identifier;
  
  if (!identifier) {
    return next(); // Skip if no identifier provided
  }
  
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { attempts: 0, resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS };
  
  // Reset if window has passed
  if (now > attempts.resetTime) {
    attempts.attempts = 0;
    attempts.resetTime = now + RATE_LIMIT_CONFIG.WINDOW_MS;
  }
  
  // Check if limit exceeded
  if (attempts.attempts >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    const resetDate = new Date(attempts.resetTime);
    return res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again later.',
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
 * 
 * @example
 * if (!user || !passwordMatch) {
 *   recordFailedAttempt(identifier);
 *   throw new UnauthorizedError('Invalid credentials');
 * }
 */
export const recordFailedAttempt = (identifier) => {
  if (!identifier) return;
  
  const now = Date.now();
  const attempts = loginAttempts.get(identifier) || { attempts: 0, resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS };
  
  // Reset if window has passed
  if (now > attempts.resetTime) {
    attempts.attempts = 0;
    attempts.resetTime = now + RATE_LIMIT_CONFIG.WINDOW_MS;
  }
  
  attempts.attempts += 1;
  loginAttempts.set(identifier, attempts);
};

/**
 * Clears login attempts for an identifier (on successful login)
 * 
 * @param {string} identifier - Username or email that successfully logged in
 * 
 * @example
 * const user = await login(identifier, password);
 * clearLoginAttempts(identifier); // Reset counter for next attempts
 */
export const clearLoginAttempts = (identifier) => {
  if (identifier) {
    loginAttempts.delete(identifier);
  }
};

