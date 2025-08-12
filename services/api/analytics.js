/* needed */
// services/api/analytics.js - פשוט במקסימום
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const analyticsService = {
  // תיעוד פתיחת מודל מוצר - שליחה ישירה
  trackModalOpen(productId) {
    if (!productId) return;
    
    axios.post(`${API_URL}/analytics/product/modal-open`, {
      productId
    }, {
      withCredentials: true
    }).catch(error => {
      console.error('Failed to track modal open:', error);
    });
  },
  
  // תיעוד קליק על קישור אפיליאט - שליחה ישירה  
  trackClick(productId) {
    if (!productId) return;
    
    axios.post(`${API_URL}/analytics/product/click`, {
      productId
    }, {
      withCredentials: true
    }).catch(error => {
      console.error('Failed to track click:', error);
    });
  },
  
  // קבלת סטטיסטיקות למוצר
  async getProductStats(productId) {
    try {
      const response = await axios.get(`${API_URL}/analytics/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get product stats:', error);
      return { modalOpens: 0, clicks: 0, conversionRate: 0 };
    }
  },
  
  // קבלת סטטיסטיקות למספר מוצרים בבת אחת
  async getBatchStats(productIds) {
    try {
      const response = await axios.post(`${API_URL}/analytics/products/batch-stats`, {
        productIds
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get batch stats:', error);
      return { stats: {} };
    }
  }
};