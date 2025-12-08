/**
 * Authentication API Module
 * Handles all authentication-related HTTP requests with security measures
 * 
 * Security features:
 * - Input sanitization before sending to backend
 * - Timeout protection against slow loris attacks
 * - Structured error handling
 * - Environment-based configuration
 */

import { LoginCredentials, LoginResponse, ApiError } from '../types';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../config/constants';
import { sanitizeInput } from '../utils/validation';

/**
 * Creates an AbortController with timeout
 * Prevents indefinite waiting and protects against DoS
 * 
 * @param timeoutMs - Timeout in milliseconds
 * @returns AbortSignal and cleanup function
 */
const createTimeoutSignal = (timeoutMs: number): { signal: AbortSignal; cleanup: () => void } => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId),
  };
};

/**
 * Authenticates user with provided credentials
 * Implements security best practices:
 * - Input sanitization
 * - Request timeout
 * - Structured error handling
 * - No sensitive data in logs
 * 
 * @param credentials - User login credentials (identifier and password)
 * @returns Promise resolving to login response with user data and token
 * @throws {ApiError} If authentication fails or network error occurs
 * 
 * @example
 * try {
 *   const response = await login({ identifier: 'john_doe', password: 'secret123' });
 *   console.log('Logged in as:', response.user?.username);
 * } catch (error) {
 *   console.error('Login failed:', error.message);
 * }
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Sanitize inputs before sending to prevent injection attacks
  const sanitizedCredentials: LoginCredentials = {
    identifier: sanitizeInput(credentials.identifier),
    password: credentials.password, // Password not sanitized (hashed on backend)
  };

  // Create abort signal with timeout
  const { signal, cleanup } = createTimeoutSignal(API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedCredentials),
      signal, // Abort request after timeout
    });

    // Parse response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      const error: ApiError = {
        message: data.error || data.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
        status: response.status,
      };
      
      // Provide user-friendly error messages based on status
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        error.message = ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
        error.message = data.error || 'Données invalides.';
      } else if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        error.message = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      
      throw error;
    }

    // Return successful response
    return {
      success: true,
      message: data.message || 'Connexion réussie',
      user: data.user,
      token: data.token,
    };
  } catch (error: any) {
    // Handle different error types
    if (error.name === 'AbortError') {
      const timeoutError: ApiError = {
        message: 'La requête a expiré. Veuillez réessayer.',
      };
      throw timeoutError;
    }
    
    // Re-throw API errors with status
    if (error.status) {
      throw error;
    }
    
    // Handle network errors
    const networkError: ApiError = {
      message: ERROR_MESSAGES.NETWORK_ERROR,
    };
    throw networkError;
  } finally {
    // Always cleanup timeout
    cleanup();
  }
};

/**
 * Logs out the current user
 * Clears all authentication data from storage
 * 
 * @example
 * logout()
 * // All auth data cleared from localStorage
 */
export const logout = (): void => {
  // Clear authentication data from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

/**
 * Checks if user is currently authenticated
 * Validates presence of auth token and user data
 * 
 * @returns True if authenticated, false otherwise
 * 
 * @example
 * if (isAuthenticatedUser()) {
 *   // Show authenticated UI
 * }
 */
export const isAuthenticatedUser = (): boolean => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('userData');
  return !!token && !!user;
};
