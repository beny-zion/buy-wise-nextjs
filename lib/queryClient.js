// src/lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

// יצירת QueryClient עם הגדרות אופטימליות
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // זמן שמירת נתונים ב-cache (5 דקות)
      staleTime: 5 * 60 * 1000,
      
      // זמן שמירת נתונים לא פעילים (10 דקות)
      cacheTime: 10 * 60 * 1000,
      
      // ניסיונות חוזרים במקרה של כשלון
      retry: 1,
      
      // לא לרענן בחזרה לחלון
      refetchOnWindowFocus: false,
      
      // לא לרענן בחיבור מחדש
      refetchOnReconnect: 'always',
    },
    mutations: {
      // ניסיון חוזר אחד למוטציות
      retry: 1,
    },
  },
});

// פונקציות עזר לניהול cache
export const cacheUtils = {
  // ניקוי כל ה-cache
  clearAll: () => {
    queryClient.clear();
  },
  
  // ניקוי cache של מוצרים
  clearProducts: () => {
    queryClient.invalidateQueries(['products']);
  },
  
  // ניקוי cache של חיפוש
  clearSearch: () => {
    queryClient.invalidateQueries(['search']);
  },
  
  // רענון נתונים ספציפיים
  refetch: (queryKey) => {
    queryClient.invalidateQueries(queryKey);
  },
  
  // קבלת נתונים מה-cache
  getCached: (queryKey) => {
    return queryClient.getQueryData(queryKey);
  },
  
  // שמירת נתונים ב-cache
  setCached: (queryKey, data) => {
    queryClient.setQueryData(queryKey, data);
  }
};