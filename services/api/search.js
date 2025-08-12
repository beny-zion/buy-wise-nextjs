/* needed */
// services/api/search.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const searchAPI = {
  /**
   * חיפוש מוצרים
   */
  async searchProducts(params) {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * קבלת הצעות חיפוש
   */
  async getSuggestions(query) {
    try {
      const response = await axios.get(`${API_URL}/search/suggestions`, {
        params: { q: query },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get suggestions error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * קבלת נתוני חיפוש (קטגוריות, מוכרים, טווח מחירים)
   */
  async getSearchData() {
    try {
      const response = await axios.get(`${API_URL}/search/data`, {
        withCredentials: true
      });
      console.log('Search data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get search data error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * קבלת קטגוריות דינמיות
   */
  async getDynamicCategories() {
    try {
      const response = await axios.get(`${API_URL}/search/categories`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * קבלת רשימת מוכרים
   */
  async getVendors() {
    try {
      const response = await axios.get(`${API_URL}/search/vendors`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get vendors error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * קבלת טווח מחירים
   */
  async getPriceRange() {
    try {
      const response = await axios.get(`${API_URL}/search/price-range`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Get price range error:', error);
      throw error.response?.data || error;
    }
  }
};