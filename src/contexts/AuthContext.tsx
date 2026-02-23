import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { mockUser } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('yetustore_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem('yetustore_user', JSON.stringify(u));
  };

  const login = async (_email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    persistUser(mockUser);
  };

  const loginWithGoogle = async () => {
    await new Promise(r => setTimeout(r, 800));
    persistUser(mockUser);
  };

  const signup = async (data: { name: string; email: string; password: string; phone: string }) => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      ...mockUser,
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
    };
    persistUser(newUser);
  };

  const verifyEmail = async (code: string) => {
    await new Promise(r => setTimeout(r, 800));
    if (code !== '123456') throw new Error('Invalid code');
    if (user) persistUser({ ...user, emailVerified: true });
  };

  const verifyPhone = async (code: string) => {
    await new Promise(r => setTimeout(r, 800));
    if (code !== '7890') throw new Error('Invalid code');
    if (user) persistUser({ ...user, phoneVerified: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yetustore_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      persistUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginWithGoogle, signup, logout, updateProfile, verifyEmail, verifyPhone }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
