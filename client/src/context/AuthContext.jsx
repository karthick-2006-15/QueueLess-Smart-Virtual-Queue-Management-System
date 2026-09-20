import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiClient from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await ApiClient.get('/auth/me');
        if (res.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn('Session verification error, using cached session if valid:', err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await ApiClient.post('/auth/login', { email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await ApiClient.post('/auth/register', userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res;
  };

  const logout = async () => {
    try {
      await ApiClient.post('/auth/logout').catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || 'GUEST',
        loading,
        login,
        register,
        logout,
        setUser,
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
