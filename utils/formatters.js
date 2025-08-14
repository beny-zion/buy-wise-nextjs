// utils/formatters.js
// 🎯 קובץ formatters הקריטי שחסר לפרויקט

/**
 * פורמט מחיר לתצוגה בשקלים
 * @param {number} price - המחיר לפורמט
 * @returns {string} מחרוזת מחיר מפורמטת
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) return 'מחיר לא זמין';
  
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * פורמט זמן שעבר (לפני כמה זמן)
 * @param {string|Date} date - התאריך לחישוב
 * @returns {string} מחרוזת זמן שעבר בעברית
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'עכשיו';
  if (diffInSeconds < 3600) return `לפני ${Math.floor(diffInSeconds / 60)} דקות`;
  if (diffInSeconds < 86400) return `לפני ${Math.floor(diffInSeconds / 3600)} שעות`;
  if (diffInSeconds < 604800) return `לפני ${Math.floor(diffInSeconds / 86400)} ימים`;
  if (diffInSeconds < 2592000) return `לפני ${Math.floor(diffInSeconds / 604800)} שבועות`;
  
  return formatDate(dateObj);
};

/**
 * פורמט תאריך לתצוגה בעברית
 * @param {string|Date} date - תאריך לפורמט
 * @returns {string} מחרוזת תאריך מפורמטת
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
};

/**
 * פורמט מספר עם הפרדת אלפים
 * @param {number} num - המספר לפורמט
 * @returns {string} מחרוזת מספר מפורמטת
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '';
  
  return new Intl.NumberFormat('he-IL').format(num);
};

/**
 * קיצור טקסט ארוך
 * @param {string} text - הטקסט לקיצור
 * @param {number} maxLength - האורך המקסימלי
 * @returns {string} טקסט מקוצר עם ... בסוף אם נדרש
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * פורמט אחוז
 * @param {number} value - הערך לפורמט
 * @param {number} total - הערך הכולל
 * @returns {string} אחוז מפורמט
 */
export const formatPercentage = (value, total) => {
  if (!value || !total || total === 0) return '0%';
  
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
};

/**
 * פורמט מספר ביקורות
 * @param {number} count - מספר הביקורות
 * @returns {string} מחרוזת מפורמטת
 */
export const formatReviewCount = (count) => {
  if (!count || count === 0) return 'אין ביקורות';
  if (count === 1) return 'ביקורת אחת';
  if (count === 2) return 'שתי ביקורות';
  if (count <= 10) return `${count} ביקורות`;
  if (count < 1000) return `${count} ביקורות`;
  
  return `${(count / 1000).toFixed(1)}K ביקורות`;
};

/**
 * פורמט דירוג כוכבים
 * @param {number} rating - הדירוג (0-5)
 * @returns {string} דירוג מפורמט
 */
export const formatRating = (rating) => {
  if (!rating || rating === 0) return 'אין דירוג';
  
  return rating.toFixed(1);
};

/**
 * בדיקה אם URL תקין
 * @param {string} url - הURL לבדיקה
 * @returns {boolean} האם הURL תקין
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * פורמט URL של תמונה עם fallback
 * @param {string} imageUrl - URL התמונה
 * @param {string} fallback - תמונת fallback
 * @returns {string} URL מפורמט
 */
export const formatImageUrl = (imageUrl, fallback = '/placeholder-image.jpg') => {
  if (!imageUrl || !isValidUrl(imageUrl)) return fallback;
  
  return imageUrl;
};