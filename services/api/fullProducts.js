/* needed */
import axios from 'axios';

// הגדרת כתובת בסיס ה-API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const API_URL = `${BASE_URL}/full-products`;

/**
 * יצירת מוצר חדש
 * @param {Object} data - נתוני המוצר והמלצת המשתמש
 * @returns {Promise} - תשובת השרת
 */
export const createFullProduct = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * קבלת מוצר לפי מזהה
 * @param {string} productId - מזהה המוצר
 * @returns {Promise} - תשובת השרת
 */
export const getFullProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * קבלת כל המוצרים עם אפשרויות סינון ודפדוף
 * @param {Object} params - פרמטרים לסינון ודפדוף
 * @returns {Promise} - תשובת השרת
 */
export const getAllFullProducts = async (params) => {
  try {
    const response = await axios.get(API_URL, { 
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * עדכון מוצר
 * @param {string} productId - מזהה המוצר
 * @param {Object} productData - הנתונים לעדכון
 * @returns {Promise} - תשובת השרת
 */
export const updateFullProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * מחיקת מוצר
 * @param {string} productId - מזהה המוצר
 * @returns {Promise} - תשובת השרת
 */
export const deleteFullProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/${productId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * רענון נתוני מוצר מאלי אקספרס
 * @param {string} productId - מזהה המוצר
 * @returns {Promise} - תשובת השרת עם נתונים מעודכנים
 */
export const refreshFullProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/refresh`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * סינון מוצרים לפי קטגוריה
 * @param {string} categoryId - מזהה הקטגוריה
 * @param {Object} params - פרמטרים נוספים
 * @returns {Promise} - תשובת השרת
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await axios.get(API_URL, { 
      params: {
        ...params,
        category: categoryId
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * סינון מוצרים לפי מוכר
 * @param {string} vendorId - מזהה המוכר
 * @param {Object} params - פרמטרים נוספים
 * @returns {Promise} - תשובת השרת
 */
export const getProductsByVendor = async (vendorId, params = {}) => {
  try {
    const response = await axios.get(API_URL, { 
      params: {
        ...params,
        vendor: vendorId
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fullProductService = {
  createFullProduct,
  getFullProduct,
  getAllFullProducts,
  updateFullProduct,
  deleteFullProduct,
  refreshFullProduct,
  getProductsByCategory,
  getProductsByVendor
};

export default fullProductService;