/* needed */
// src/services/api/vendorQuestions.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const vendorQuestionsService = {
  // קבלת שאלות
  async getQuestions(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/vendor/questions`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // מענה על שאלה
  async replyToQuestion(questionId, content) {
    try {
      const response = await axios.post(
        `${API_URL}/vendor/questions/${questionId}/reply`,
        { content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת התראות
  async getNotifications(onlyUnread = true) {
    try {
      const response = await axios.get(`${API_URL}/vendor/notifications`, {
        params: { onlyUnread },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // סימון התראה כנקראה
  async markNotificationAsRead(notificationId) {
    try {
      const response = await axios.put(
        `${API_URL}/vendor/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // סימון כל ההתראות כנקראו
  async markAllAsRead() {
    try {
      const response = await axios.put(
        `${API_URL}/vendor/notifications/read-all`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};