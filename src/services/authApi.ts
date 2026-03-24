import type {
  AuthApiService,
  LoginCredentials,
  RegisterInput,
  AuthResponse,
  AuthTokens,
  User,
  PasswordResetInput,
  PasswordResetConfirmInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '../types/auth';
import { API_BASE_URL, TOKEN_KEYS } from '../config/api';

// Token storage keys (use centralized config)
const ACCESS_TOKEN_KEY = TOKEN_KEYS.accessToken;
const REFRESH_TOKEN_KEY = TOKEN_KEYS.refreshToken;
const TOKEN_EXPIRY_KEY = TOKEN_KEYS.tokenExpiry;

// Token management
export const tokenStorage = {
  setTokens: (tokens: AuthTokens) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + tokens.expiresIn * 1000));
  },
  
  getAccessToken: (): string | null => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    // Debug
    console.log('getAccessToken called:', {
      hasToken: !!token,
      expiry,
      now: Date.now(),
      isExpired: expiry ? Date.now() > Number(expiry) : false
    });
    
    if (expiry && Date.now() > Number(expiry)) {
      console.log('Token expired, clearing...');
      tokenStorage.clearTokens();
      return null;
    }
    return token;
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },
  
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getAccessToken();
    const result = token !== null;
    
    console.log('isAuthenticated check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      result
    });
    
    return result;
  },
};

// Fetch wrapper with auth headers and token refresh
// #12: 支持 HttpOnly Cookie 模式
async function fetchWithAuth(url: string, options?: RequestInit, retry = true): Promise<Response> {
  const token = tokenStorage.getAccessToken();
  
  // #12: credentials: 'include' 用于 HttpOnly Cookie
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 发送和接收 cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  
  // Handle 401 - try to refresh token once
  if (response.status === 401 && retry) {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        // Call refresh endpoint with credentials
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // #12: 支持 Cookie
          body: JSON.stringify({ refreshToken }),
        });
        
        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }
        
        const apiResponse = await refreshResponse.json();
        const newTokens = apiResponse.data;
        tokenStorage.setTokens(newTokens);
        
        // Retry the original request with new token
        return await fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.accessToken}`,
            ...options?.headers,
          },
        });
      } catch {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    } else {
      // No refresh token, redirect to login
      tokenStorage.clearTokens();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
  }
  
  return response;
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@silentcurator.com',
    name: 'Elias Thorne',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaMLomqb_zR9AVBjxwFiCx-MIekBThBQFNHlI6tUf9jF3TojBNSOsGVzcfDJc6wcTeZ6mPhu2811qlR7qCKrv6hR8Bf3n77L4GxHEBW9PMeNzfZbyjaitcQLiyzE6uNU1XYjRfzWvYb3E8aggDIcNI4gCxCoaOITLGeybk1BZbT1IAp-MPAL6X2nWRx57guPbZ_0ubBbH39HuEz54sk5J_iRwVGYJ1uterEuIS-rub4mFG1S_fkX88MmYidvCq0yrGD2wSFspl6hDH',
    role: 'admin',
    bio: 'Designer and writer focused on minimal aesthetics.',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock auth service
export const mockAuthApiService: AuthApiService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation (in real app, this would be server-side)
    if (credentials.email === 'admin@silentcurator.com' && credentials.password === 'password') {
      const user = mockUsers[0];
      const tokens: AuthTokens = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600, // 1 hour
      };
      
      tokenStorage.setTokens(tokens);
      return { user, tokens };
    }
    
    throw new Error('Invalid email or password');
  },
  
  async register(input: RegisterInput): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock registration
    const newUser: User = {
      id: String(Date.now()),
      email: input.email,
      name: input.name,
      role: 'author',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const tokens: AuthTokens = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
    };
    
    tokenStorage.setTokens(tokens);
    return { user: newUser, tokens };
  },
  
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    tokenStorage.clearTokens();
  },
  
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Mock token refresh
    const tokens: AuthTokens = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
    };
    
    tokenStorage.setTokens(tokens);
    return tokens;
  },
  
  async getCurrentUser(): Promise<User | null> {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      return null;
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers[0];
  },
  
  async requestPasswordReset(_input: PasswordResetInput): Promise<void> {
    void _input;
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  async resetPassword(input: PasswordResetConfirmInput): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Password reset with token:', input.token);
  },
  
  async changePassword(_input: ChangePasswordInput): Promise<void> {
    void _input;
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  async updateProfile(input: UpdateProfileInput): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers[0];
    return {
      ...user,
      ...input,
      updatedAt: new Date().toISOString(),
    };
  },
  
  async deleteAccount(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    tokenStorage.clearTokens();
  },
};

// Suppress unused variable warning
void 0;

// Real auth API service (for production)
export const realAuthApiService: AuthApiService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // #12: 支持 HttpOnly Cookie
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.error?.message || error.message || 'Login failed';
      throw new Error(errorMsg);
    }
    
    const apiResponse = await response.json();
    const authData = apiResponse.data;
    
    // Debug: log tokens
    console.log('Login success, tokens:', {
      hasAccess: !!authData.tokens.accessToken,
      hasRefresh: !!authData.tokens.refreshToken,
      expiresIn: authData.tokens.expiresIn
    });
    
    // #12: 仍然存储 token 到 localStorage 作为备用（兼容 Bearer 模式）
    // 但主要依赖 HttpOnly Cookie
    tokenStorage.setTokens(authData.tokens);
    
    // Verify storage
    console.log('After storage, isAuthenticated:', tokenStorage.isAuthenticated());
    
    return authData;
  },
  
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // #12: 支持 HttpOnly Cookie
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.error?.message || error.message || 'Registration failed';
      throw new Error(errorMsg);
    }
    
    const apiResponse = await response.json();
    const authData = apiResponse.data;
    tokenStorage.setTokens(authData.tokens);
    return authData;
  },
  
  async logout(): Promise<void> {
    try {
      await fetchWithAuth(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    } finally {
      tokenStorage.clearTokens();
    }
  },
  
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // #12: 支持 HttpOnly Cookie
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      tokenStorage.clearTokens();
      throw new Error('Token refresh failed');
    }
    
    const apiResponse = await response.json();
    const tokens: AuthTokens = apiResponse.data;
    tokenStorage.setTokens(tokens);
    return tokens;
  },
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
      if (!response.ok) return null;
      const apiResponse = await response.json();
      return apiResponse.data;
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return null;
    }
  },
  
  async requestPasswordReset(input: PasswordResetInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }
  },
  
  async resetPassword(input: PasswordResetConfirmInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }
  },
  
  async changePassword(input: ChangePasswordInput): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password change failed');
    }
  },
  
  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/profile`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }
    
    const data = await response.json();
    return data.user;
  },
  
  async deleteAccount(): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Account deletion failed');
    }
    
    tokenStorage.clearTokens();
  },
};

// Export auth service (switch between mock and real)
// export const authApiService = mockAuthApiService;
export const authApiService = realAuthApiService;
