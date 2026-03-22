// Authentication types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  token: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// Auth API Service interface
export interface AuthApiService {
  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(input: RegisterInput): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthTokens>;
  getCurrentUser(): Promise<User | null>;
  
  // Password management
  requestPasswordReset(input: PasswordResetInput): Promise<void>;
  resetPassword(input: PasswordResetConfirmInput): Promise<void>;
  changePassword(input: ChangePasswordInput): Promise<void>;
  
  // Profile management
  updateProfile(input: UpdateProfileInput): Promise<User>;
  deleteAccount(): Promise<void>;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context actions
export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  clearError: () => void;
}
