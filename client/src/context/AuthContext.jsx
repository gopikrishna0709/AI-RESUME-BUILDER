import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('resumai_jwt_token') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Verify session on initial app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('resumai_jwt_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Initial session validation failed, resetting auth');
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data?.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      localStorage.setItem('resumai_jwt_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setIsAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data?.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      localStorage.setItem('resumai_jwt_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setIsAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    if (res.data?.success) {
      const newToken = res.data.token;
      const newUser = res.data.user;
      localStorage.setItem('resumai_jwt_token', newToken);
      setToken(newToken);
      setUser(newUser);
      setIsAuthModalOpen(false);
      return res.data;
    }
    throw new Error(res.data?.message || 'Demo login failed');
  };

  const logout = () => {
    try {
      localStorage.removeItem('resumai_jwt_token');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing auth storage:', e);
    }
    setToken('');
    setUser(null);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
