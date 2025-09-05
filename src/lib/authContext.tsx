'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from './auth';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<User>; // changed to return User
  register: (userData: RegisterRequest) => Promise<User>; // changed to return User
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getUser();
    const token = authService.getAccessToken();
    
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Save tokens and user data
      authService.saveTokens(response.tokens);
      authService.saveUser(response.user);
      setUser(response.user);
      return response.user; // return fresh user
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // Save tokens and user data
      authService.saveTokens(response.tokens);
      authService.saveUser(response.user);
      setUser(response.user);
      return response.user; // return fresh user
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = !!user && authService.isAuthenticated();
  const isAdmin = !!user && ((user.is_staff ?? false) || (user.is_superuser ?? false));

  const value = {
    user,
    accessToken: authService.getAccessToken(),
    refreshToken: authService.getRefreshToken(),
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
    loading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
