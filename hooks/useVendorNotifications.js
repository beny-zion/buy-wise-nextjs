/* needed */
// src/hooks/useVendorNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vendorQuestionsService } from '../services/api/vendorQuestions';

export const useVendorNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // טעינת התראות
  const loadNotifications = useCallback(async (onlyUnread = true) => {
    if (!user?.isVendor) return;

    setLoading(true);
    try {
      const response = await vendorQuestionsService.getNotifications(onlyUnread);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
      setError(null);
    } catch (err) {
      setError(err.message || 'שגיאה בטעינת ההתראות');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // סימון התראה כנקראה
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await vendorQuestionsService.markNotificationAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // סימון כל ההתראות כנקראו
  const markAllAsRead = useCallback(async () => {
    try {
      await vendorQuestionsService.markAllAsRead();
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, []);

  // טעינה ראשונית ורענון תקופתי
  useEffect(() => {
    if (user?.isVendor) {
      loadNotifications();
      
      // רענון כל 30 שניות
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead
  };
};