'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOTP: (fullName: string, email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, code: string) => Promise<{ success: boolean; error?: string; warning?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user from backend (cookie-based auth)
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      
      if (response.data) {
        console.log('AuthContext: User fetched successfully:', response.data);
        setUser(response.data);
        return true;
      }
      
      return false;
    } catch (error) {
      // Silently handle - this is expected if user not authenticated
      // or endpoint doesn't exist yet
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthContext: Initializing auth...');
      // Try to fetch user data (will fail if not authenticated)
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const requestOTP = useCallback(async (fullName: string, email: string) => {
    try {
      console.log('AuthContext: Requesting OTP...', { fullName, email });
      const response = await authApi.requestOTP({ full_name: fullName, email });
      console.log('AuthContext: OTP Response:', response);
      
      // Check various success conditions
      // 1. If response has data field with user/token
      if (response.data) {
        console.log('AuthContext: Success - response.data exists');
        return { success: true };
      }
      
      // 2. If response has message field (some APIs return { message: "OTP sent", success: true })
      if (response.message && !response.error) {
        console.log('AuthContext: Success - response.message exists, no error');
        return { success: true };
      }
      
      // 3. If there's an error field, return it
      if (response.error) {
        console.log('AuthContext: Failed - response.error exists:', response.error);
        return { success: false, error: response.error };
      }
      
      // 4. Default: if we got here without throwing, assume success
      console.log('AuthContext: Success - default (no error thrown)');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: requestOTP caught error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to request OTP'
      };
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, code: string) => {
    try {
      console.log('AuthContext: Verifying OTP...', { email, code });
      const response = await authApi.verifyOTP({ email, code });
      
      // Log the response
      console.log('AuthContext: Verify OTP Response:', response);
      console.log('AuthContext: Response keys:', Object.keys(response));
      
      // Check if verification was successful
      // Backend returns success message, cookie is set automatically
      const isSuccessMessage = response.message?.toLowerCase().includes('berhasil') || 
                               response.message?.toLowerCase().includes('success') ||
                               response.message?.toLowerCase().includes('verified') ||
                               response.message?.toLowerCase().includes('login');
      
      const hasError = response.error;
      
      console.log('AuthContext: Is success message:', isSuccessMessage);
      console.log('AuthContext: Has error:', hasError);
      
      if (hasError) {
        console.log('AuthContext: Verification failed with error:', response.error);
        return { success: false, error: response.error };
      }
      
      if (isSuccessMessage || response.data) {
        console.log('AuthContext: Verification successful! Fetching user data...');
        // Cookie is set, now try to fetch user data
        // If this fails (404), we'll still return success
        try {
          await refreshUser();
        } catch (error) {
          console.log('AuthContext: Could not fetch user after verify (backend endpoint might not exist)');
        }
        return { success: true };
      }
      
      // Default: if no error thrown, assume success
      console.log('AuthContext: Verification completed (no error)');
      try {
        await refreshUser();
      } catch (error) {
        console.log('AuthContext: Could not fetch user after verify (backend endpoint might not exist)');
      }
      return { success: true };
    } catch (error) {
      console.error('AuthContext: verifyOTP caught error:', error);
      console.error('AuthContext: Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid OTP code'
      };
    }
  }, [refreshUser]);

  const logout = useCallback(async () => {
    console.log('AuthContext: Logging out...');
    await authApi.logout();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    requestOTP,
    verifyOTP,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
