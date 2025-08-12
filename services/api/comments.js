/* needed */
// services/api/comments.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';;

export const commentService = {
  // יצירת תגובה חדשה
  async createComment(commentData) {
    try {
      const response = await axios.post(`${API_URL}/comments`, commentData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת תגובות למוצר
  async getProductComments(productId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/comments/product/${productId}`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת תגובות מקוננות
  async getCommentReplies(commentId, params = {}) {
    try {
      const response = await axios.get(`${API_URL}/comments/${commentId}/replies`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // לייק/ביטול לייק לתגובה
  async toggleCommentLike(commentId) {
    try {
      const response = await axios.post(`${API_URL}/comments/${commentId}/like`, {}, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // עדכון תגובה
  async updateComment(commentId, data) {
    try {
      const response = await axios.put(`${API_URL}/comments/${commentId}`, data, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // מחיקת תגובה
  async deleteComment(commentId) {
    try {
      const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת סטטיסטיקות תגובות
  async getCommentStats(productId) {
    try {
      const response = await axios.get(`${API_URL}/comments/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};