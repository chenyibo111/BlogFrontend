// API Service exports
// Switch between mock and real API here

import { realApiService } from './api';

// Use real API for production
export const api = realApiService;

// Re-export types for convenience
export type { ApiService } from '../types/api';
