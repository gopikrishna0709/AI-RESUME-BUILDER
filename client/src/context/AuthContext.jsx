import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('resumai_jwt_token') || '';
    } catch {
      return '';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('resumai_user_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
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
            localStorage.setItem('resumai_user_data', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Initial session validation failed or offline, checking local token');
          // If token was 401 unauthorized, log out
          if (err.response?.status === 401) {
            logout();
          }
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
      localStorage.setItem('resumai_user_data', JSON.stringify(newUser));
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
      localStorage.setItem('resumai_user_data', JSON.stringify(newUser));
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
      localStorage.setItem('resumai_user_data', JSON.stringify(newUser));
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
      localStorage.removeItem('resumai_user_data');
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
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
