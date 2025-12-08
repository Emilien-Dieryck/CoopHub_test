/**
 * BadRequestError Exception Class
 * HTTP 400 - Bad Request
 * Used when client sends invalid or malformed request data
 */
export class BadRequestError extends Error {
  /**
   * Creates a new BadRequestError instance
   *
   * @param {string} message - Error message describing what went wrong
   *
   * @example
   * throw new BadRequestError('Email is required');
   */
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
