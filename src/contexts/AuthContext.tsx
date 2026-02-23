import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import {
  getClientMe,
  loginClient,
  registerClient,
  loginWithGoogle,
  logoutClient,
  verifyEmail as apiVerifyEmail,
  verifyPhone as apiVerifyPhone,
  resendEmail as apiResendEmail,
  resendPhone as apiResendPhone,
  setPhone as apiSetPhone,
  updateClientProfile,
  getAccessToken,
} from '@/lib/api';
import { getGoogleIdToken } from '@/lib/google';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken?: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  resendEmail: () => Promise<void>;
  resendPhone: () => Promise<void>;
  setPhone: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await getClientMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const u = await loginClient(email, password);
    setUser(u);
  };

  const loginWithGoogleHandler = async (idToken?: string) => {
    const token = idToken || await getGoogleIdToken();
    const u = await loginWithGoogle(token);
    setUser(u);
  };

  const signup = async (data: { name: string; email: string; password: string; phone: string }) => {
    const u = await registerClient(data);
    setUser(u);
  };

  const verifyEmail = async (code: string) => {
    const u = await apiVerifyEmail(code);
    setUser(u);
  };

  const verifyPhone = async (code: string) => {
    const u = await apiVerifyPhone(code);
    setUser(u);
  };

  const resendEmail = async () => {
    await apiResendEmail();
  };

  const resendPhone = async () => {
    await apiResendPhone();
  };

  const setPhone = async (phone: string) => {
    const u = await apiSetPhone(phone);
    setUser(u);
  };

  const logout = () => {
    logoutClient();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const u = await updateClientProfile(data);
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle: loginWithGoogleHandler,
      signup,
      logout,
      updateProfile,
      verifyEmail,
      verifyPhone,
      resendEmail,
      resendPhone,
      setPhone,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
