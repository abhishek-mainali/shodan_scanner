import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      setUser(data.user);
      localStorage.setItem('reconx_access_token', data.accessToken);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
      localStorage.removeItem('reconx_access_token');
      window.location.href = '/login';
    }
  };

  const checkMe = async () => {
    try {
      // If we have an access token, try to get profile
      const token = localStorage.getItem('reconx_access_token');
      if (token) {
        const { data } = await api.get('/api/auth/me');
        setUser(data);
      } else {
        // No token, but maybe we have a refresh cookie? 
        // Let the interceptor handle the refresh
        const { data } = await api.post('/api/auth/refresh');
        localStorage.setItem('reconx_access_token', data.accessToken);
        const { data: me } = await api.get('/api/auth/me');
        setUser(me);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, checkMe, loading, hasRole: (r) => user?.role === r }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
