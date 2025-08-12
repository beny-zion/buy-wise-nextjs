/* needed */
// services/api/favorites.js
import axios from 'axios';

// const API_URL = 'https://product-pick-server.onrender.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const favoritesService = {
  // הוספת מוצר למועדפים
  async addFavorite(productId) {
    try {
      const response = await axios.post(`${API_URL}/favorites`, { productId }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // הסרת מוצר מהמועדפים
  async removeFavorite(productId) {
    try {
      const response = await axios.delete(`${API_URL}/favorites/${productId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת רשימת המוצרים המועדפים
  async getFavorites() {
    try {
      const response = await axios.get(`${API_URL}/favorites`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // בדיקה אם מוצר נמצא במועדפים
  async checkFavoriteStatus(productId) {
    try {
      const response = await axios.get(`${API_URL}/favorites/status/${productId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return { success: false, isFavorite: false };
    }
  }
};