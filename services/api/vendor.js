/* needed */
// services/api/vendor.js - עדכון לאנליטיקה פשוטה
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const vendorService = {
  // קבלת כל המוצרים של המוכר
  async getProducts(params = {}) {
    try {
      console.log(`Fetching products with params:`, params);
      const response = await axios.get(`${API_URL}/vendor/products`, {
        params,
        withCredentials: true
      });
      console.log(`Products fetched successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products:`, error);
      throw error.response?.data || error;
    }
  },

  // קבלת מוצר ספציפי
  async getProduct(productId) {
    try {
      const response = await axios.get(`${API_URL}/vendor/products/${productId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // עדכון מוצר
  async updateProduct(productId, updateData) {
    try {
      const response = await axios.put(
        `${API_URL}/vendor/products/${productId}`, 
        updateData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // מחיקת מוצר
  async deleteProduct(productId) {
    try {
      const response = await axios.delete(
        `${API_URL}/vendor/products/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // קבלת סטטיסטיקות כלליות - נתיב חדש
  async getStats() {
    try {
      const response = await axios.get(`${API_URL}/vendor/analytics/stats`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      // מחזיר ערכי ברירת מחדל במקום זריקת שגיאה
      return {
        success: true,
        data: {
          totalModalOpens: 0,
          totalClicks: 0,
          averageConversionRate: 0,
          totalProducts: 0
        }
      };
    }
  },

  // קבלת סטטיסטיקות למוצר ספציפי - נתיב חדש  
  async getProductStats(productId) {
    try {
      const response = await axios.get(`${API_URL}/vendor/analytics/product/${productId}/stats`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      // מחזיר ערכי ברירת מחדל במקום זריקת שגיאה
      return {
        success: true,
        data: {
          modalOpens: 0,
          clicks: 0,
          conversionRate: 0
        }
      };
    }
  },
  
  // קבלת סטטיסטיקות לכל המוצרים - נתיב חדש
  async getAllProductsStats() {
    try {
      const response = await axios.get(`${API_URL}/vendor/analytics/all-products`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products stats:', error);
      // מחזיר ערכי ברירת מחדל במקום זריקת שגיאה
      return {
        success: true,
        data: []
      };
    }
  }
};