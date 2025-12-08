/**
 * UnauthorizedError Exception Class
 * HTTP 401 - Unauthorized
 * Used when user authentication fails or credentials are invalid
 */
export class UnauthorizedError extends Error {
  /**
   * Creates a new UnauthorizedError instance
   *
   * @param {string} message - Error message describing authentication failure
   *
   * @example
   * throw new UnauthorizedError('Invalid username or password');
   */
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}
