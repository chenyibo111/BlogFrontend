/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { authApiService, tokenStorage } from '../services/authApi';
import type {
  User,
  LoginCredentials,
  RegisterInput,
  UpdateProfileInput,
  AuthState,
  AuthActions,
} from '../types/auth';

// Auth Context
interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log('initAuth started');
      
      // Only call API if we have a token
      const isAuth = tokenStorage.isAuthenticated();
      console.log('isAuthenticated result:', isAuth);
      
      if (!isAuth) {
        console.log('No token, setting not authenticated');
        if (mounted) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
        return;
      }

      try {
        console.log('Calling getCurrentUser...');
        const user = await authApiService.getCurrentUser();
        console.log('getCurrentUser result:', user);
        
        if (mounted) {
          setState({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
          console.log('Auth state updated:', { user: !!user, isAuthenticated: !!user });
        }
      } catch (error) {
        console.error('getCurrentUser error:', error);
        // Token expired or invalid - clear it
        tokenStorage.clearTokens();
        if (mounted) {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    
    try {
      const response = await authApiService.login(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    
    try {
      const response = await authApiService.register(input);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApiService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    setState(s => ({ ...s, isLoading: true, error: null }));
    
    try {
      const user = await authApiService.updateProfile(input);
      setState(s => ({
        ...s,
        user,
        isLoading: false,
      }));
    } catch (error) {
      setState(s => ({
        ...s,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({ ...s, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hooks
export function useRequireAuth(redirectUrl = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectUrl]);
  
  return { isAuthenticated, isLoading };
}

export function useAdminOnly() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'editor';
  
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isAdmin, isLoading]);
  
  return { isAdmin, isLoading };
}

// Check if user is authenticated (synchronous, for guards)
export const isAuthenticated = () => tokenStorage.isAuthenticated();

// Get current user (synchronous)
export const getCurrentUser = (): User | null => {
  // This is a simplified version - in real app you'd cache the user
  return null;
};
