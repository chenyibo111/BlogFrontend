/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * All services should import from this file instead of defining their own API_BASE_URL.
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL for the API (default: http://localhost:3000/api)
 */

// User can set either with or without /api suffix, we normalize it
const userBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * API Base URL (includes /api suffix)
 * Use this for API calls
 */
export const API_BASE_URL = userBaseUrl;

/**
 * Server Base URL (without /api suffix)
 * Use this for static file URLs
 */
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT = 10000;

/**
 * Upload configuration
 */
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

/**
 * Token storage keys
 */
export const TOKEN_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  tokenExpiry: 'token_expiry',
} as const;