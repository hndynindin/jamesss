import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hadirku_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hadirku_token');
      const savedUser = localStorage.getItem('hadirku_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile from server to ensure fresh role/profile
          const res = await api.get('/auth/profile');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('hadirku_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Failed to verify token on startup:', err.message);
          localStorage.removeItem('hadirku_token');
          localStorage.removeItem('hadirku_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    if (res.success && res.token) {
      localStorage.setItem('hadirku_token', res.token);
      localStorage.setItem('hadirku_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login gagal.');
  };

  const logout = () => {
    localStorage.removeItem('hadirku_token');
    localStorage.removeItem('hadirku_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('hadirku_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!token }}>
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
