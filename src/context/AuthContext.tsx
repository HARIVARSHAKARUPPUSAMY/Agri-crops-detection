import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccountType } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, accountType?: AccountType) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    email: string,
    password: string,
    accountType: AccountType,
    organizationName?: string,
    contactNumber?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('agri_grade_token');
    const savedUser = localStorage.getItem('agri_grade_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('agri_grade_token');
        localStorage.removeItem('agri_grade_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, accountType?: AccountType) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, accountType })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agri_grade_token', data.token);
      localStorage.setItem('agri_grade_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed.' };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    accountType: AccountType,
    organizationName?: string,
    contactNumber?: string
  ) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, accountType, organizationName, contactNumber })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('agri_grade_token', data.token);
      localStorage.setItem('agri_grade_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection failed.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agri_grade_token');
    localStorage.removeItem('agri_grade_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) return { success: false, error: 'Unauthorized' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) {
        return { success: false, error: result.error || 'Failed to update profile.' };
      }
      setUser(result.user);
      localStorage.setItem('agri_grade_user', JSON.stringify(result.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update failed.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
