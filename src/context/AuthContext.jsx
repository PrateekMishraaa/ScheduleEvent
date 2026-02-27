// 📁 src/context/AuthContext.jsx (COMPLETELY FIXED)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // ✅ Set auth header on axios instance whenever token changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // ✅ Fetch current user - using useCallback to prevent infinite loops
  const fetchCurrentUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/me');
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
    }
  }, [token]); // ✅ Added token as dependency

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]); // ✅ Now safe with useCallback

  // ✅ Register with proper error handling
// In AuthContext.jsx - update register function

const register = async (formData) => {
  // ✅ Backend expects these fields
  const response = await
   axios.post('https://scheduleeventbackend.onrender.com/api/auth/register', 
    {
    fullName: formData.fullName,
    email: formData.email,
    password: formData.password,
    phone: formData.phone,
    schoolName: formData.schoolName,  // ✅ NEW
    className: formData.className,     // ✅ NEW
    city: formData.city || ''
  });
  
  const { token: newToken, user: newUser } = response.data;
  
  localStorage.setItem('token', newToken);
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  setToken(newToken);
  setUser(newUser);
  
  return response.data;
};

  // ✅ Login with proper error handling
  const login = async (email, password) => {
    try {
      const response = await
       axios.post('https://scheduleeventbackend.onrender.com/auth/login', { email, password });
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
      const response = await
       axios.put('https://scheduleeventbackend.onrender.com/auth/update-profile', data);
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
      const response = await
       axios.get('https://scheduleeventbackend.onrender.com/activity/my-messages');
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Get user stats
  const getMyStats = async () => {
    try {
      const response = await 
      axios.get('https://scheduleeventbackend.onrender.com/activity/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Validate join code with uppercase
  const validateJoinCode = async (code) => {
    try {
      const response = await 
      axios.get(`https://scheduleeventbackend.onrender.com/institutions/join-code/${code.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error('Validate join code error:', error.response?.data || error.message);
      throw error;
    }
  };

  // ✅ Refresh user data
  const refreshUser = async () => {
    try {
      const response = await
       axios.get('https://scheduleeventbackend.onrender.com/auth/me');
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
    register,
    login,
    logout,
    updateProfile,
    getMyMessages,
    getMyStats,
    validateJoinCode,
    refreshUser,
    axiosInstance, // Export for other components if needed
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