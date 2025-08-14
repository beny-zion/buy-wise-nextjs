'use client';

// contexts/AuthContext.jsx - מתוקן לNext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // תיקון: next/navigation במקום react-router-dom

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Next.js router

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // בדיקה ב-localStorage תחילה
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }

        // ניסיון קריאה לשרת (אם זמין)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const response = await fetch(`${apiUrl}/auth/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.log('Auth check skipped - server not available');
        // לא מדפיסים שגיאה, פשוט ממשיכים בלי authentication
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/products');
        return { success: true, user: data.user };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'שגיאה בהתחברות' };
    }
  };

  const logout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.log('Logout error (continuing anyway):', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // פונקציה לדמות משתמש מחובר (לבדיקות)
  const mockLogin = () => {
    const mockUser = {
      _id: 'mock-user-1',
      fullName: 'משתמש לדוגמה',
      email: 'user@example.com',
      profileImage: 'https://picsum.photos/100/100?random=999',
      isVendor: false,
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    router.push('/products');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserProfile,
    mockLogin, // לבדיקות בלבד
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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