/* needed */
// src/services/api/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const updateProfile = async (userData) => {
  try {
    // וודא שאתה שולח את הבקשה עם הכותרת הנכונה כשמדובר בקבצים
    return await axiosInstance.put('/user/profile', userData, {
      headers: {
        'Content-Type': 'multipart/form-data' // חשוב במיוחד עבור העלאת תמונות
      }
    });
  } catch (error) {
    throw handleError(error);
  }
};

export const logout = async () => {
  try {
    return await axiosInstance.post('/user/logout');
  } catch (error) {
    throw handleError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/user/current');
    return response;
  } catch (error) {
    throw handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    throw {
      message: error.response.data.message || 'שגיאת שרת',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    throw {
      message: 'לא ניתן להתחבר לשרת',
      status: 503
    };
  } else {
    // Request setup error
    throw {
      message: 'שגיאה בשליחת הבקשה',
      status: 400
    };
  }
};