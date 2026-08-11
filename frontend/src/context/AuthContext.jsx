import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('salesgenie_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('salesgenie_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('salesgenie_token', token);
    } else {
      localStorage.removeItem('salesgenie_token');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setToken(res.data.access_token);
      const userData = {
        id: res.data.user_id,
        name: res.data.name,
        email: res.data.email,
      };
      setUser(userData);
      localStorage.setItem('salesgenie_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Invalid email or password',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      setToken(res.data.access_token);
      const userData = {
        id: res.data.user_id,
        name: res.data.name,
        email: res.data.email,
      };
      setUser(userData);
      localStorage.setItem('salesgenie_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('salesgenie_token');
    localStorage.removeItem('salesgenie_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
