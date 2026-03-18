// 📁 src/context/AuthContext.jsx (COMPLETELY FIXED)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000/api';

// Create axios instances
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const baseAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // ✅ Set auth header on axios instances whenever token changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      baseAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
      delete baseAxios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ✅ Fetch current user - using useCallback to prevent infinite loops
  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setInitialCheckDone(true);
      return;
    }

    try {
      const response = await baseAxios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth error:', error.response?.data || error.message);
      
      // ✅ If token is invalid/expired, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // ✅ Register with proper error handling
  const register = async (formData) => {
    try {
      // ✅ Backend expects these fields
      const response = await baseAxios.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        schoolName: formData.schoolName,
        className: formData.className,
        city: formData.city || ''
      });
      
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Login with proper error handling
  const login = async (email, password) => {
    try {
      const response = await baseAxios.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // ✅ Update Profile
  const updateProfile = async (data) => {
    try {
      const response = await baseAxios.put('/auth/update-profile', data);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Get user messages
  const getMyMessages = async () => {
    try {
      const response = await baseAxios.get('/activity/my-messages');
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Get user stats
  const getMyStats = async () => {
    try {
      const response = await baseAxios.get('/activity/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Validate join code with uppercase
  const validateJoinCode = async (code) => {
    try {
      const response = await baseAxios.get(`/institutions/join-code/${code.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('Validate join code error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Refresh user data
  const refreshUser = async () => {
    try {
      const response = await baseAxios.get('/auth/me');
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Refresh user error:', error.response?.data || error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    token,
    initialCheckDone,
    register,
    login,
    logout,
    updateProfile,
    getMyMessages,
    getMyStats,
    validateJoinCode,
    refreshUser,
    axiosInstance,
    baseAxios,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook with better error message
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('❌ useAuth must be used within AuthProvider. Make sure your component is wrapped in <AuthProvider>.');
  }
  return context;
};

export default AuthContext;