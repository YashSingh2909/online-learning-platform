import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('edusphereUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.data);
        localStorage.setItem('edusphereUser', JSON.stringify(response.data.data));
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('edusphereUser');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { accessToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('edusphereUser', JSON.stringify(userData));
      setToken(accessToken);
      setUser(userData);
      return userData;
    } catch (error) {
      const fallbackError = error.response?.data || error.message || 'Login failed';
      throw typeof fallbackError === 'string' ? { message: fallbackError } : fallbackError;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'student') => {
    setLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, role });
      // Don't auto-login - just return success
      return response.data;
    } catch (error) {
      const fallbackError = error.response?.data || error.message || 'Registration failed';
      throw typeof fallbackError === 'string' ? { message: fallbackError } : fallbackError;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('edusphereUser');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
