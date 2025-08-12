// contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

// Set axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token with backend
      const response = await axios.get('/user/me');
      
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };
  
  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/user/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        
        // Redirect to intended page or home
        const returnUrl = sessionStorage.getItem('returnUrl') || '/';
        sessionStorage.removeItem('returnUrl');
        router.push(returnUrl);
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await axios.post('/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      
      // Redirect to home
      router.push('/');
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/user/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Save token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setUser(user);
        
        // Redirect to profile setup or home
        router.push('/profile');
        
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const response = await axios.put('/user/profile', updates);
      
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Update failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      return { success: false, error: message };
    }
  };
  
  // Handle Google OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if returning from Google OAuth
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Save token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data
        await checkAuth();
        
        // Clean URL
        window.history.replaceState({}, document.title, pathname);
      }
    };
    
    handleOAuthCallback();
  }, [pathname]);
  
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};