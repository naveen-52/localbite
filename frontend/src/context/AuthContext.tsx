import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; phoneNumber: string; password: string; role: Role }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('localbite_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('localbite_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('localbite_user');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    if (response.success && response.data) {
      const auth = response.data;
      const userObj: User = {
        id: auth.userId,
        fullName: auth.fullName,
        email: auth.email,
        phoneNumber: auth.phoneNumber,
        role: auth.role,
      };
      setToken(auth.accessToken);
      setUser(userObj);
      localStorage.setItem('localbite_token', auth.accessToken);
      localStorage.setItem('localbite_user', JSON.stringify(userObj));
    }
  };

  const register = async (data: { fullName: string; email: string; phoneNumber: string; password: string; role: Role }) => {
    const response = await api.register(data);
    if (response.success && response.data) {
      const auth = response.data;
      const userObj: User = {
        id: auth.userId,
        fullName: auth.fullName,
        email: auth.email,
        phoneNumber: auth.phoneNumber,
        role: auth.role,
      };
      setToken(auth.accessToken);
      setUser(userObj);
      localStorage.setItem('localbite_token', auth.accessToken);
      localStorage.setItem('localbite_user', JSON.stringify(userObj));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('localbite_token');
    localStorage.removeItem('localbite_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
