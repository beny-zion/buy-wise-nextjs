// src/services/cache/cacheService.js
// שירות cache פשוט ויעיל ללא תלות בספריות חיצוניות

// מנהל cache בזיכרון
class InMemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }
  
  // שמירה ב-cache עם TTL
  set(key, value, ttl = 300000) { // 5 דקות ברירת מחדל
    // ביטול טיימר קיים
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    // שמירת הערך
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
    
    // הגדרת טיימר למחיקה אוטומטית
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);
    
    this.timers.set(key, timer);
  }
  
  // קבלת ערך מה-cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // בדיקה אם פג תוקף
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  // בדיקה אם קיים
  has(key) {
    return this.get(key) !== null;
  }
  
  // מחיקה
  delete(key) {
    this.cache.delete(key);
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }
  
  // ניקוי כל ה-cache
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }
  
  // ניקוי לפי pattern
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    const keysToDelete = [];
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.delete(key));
  }
  
  // קבלת גודל ה-cache
  size() {
    return this.cache.size;
  }
}

// יצירת instance של cache
export const memoryCache = new InMemoryCache();

// שירות cache מרכזי
export const cacheService = {
  // cache למוצרים
  products: {
    set: (products, page = 1) => {
      const key = `products_page_${page}`;
      memoryCache.set(key, products, 1000 * 60 * 5); // 5 דקות
    },
    
    get: (page = 1) => {
      const key = `products_page_${page}`;
      return memoryCache.get(key);
    },
    
    setById: (productId, product) => {
      const key = `product_${productId}`;
      memoryCache.set(key, product, 1000 * 60 * 10); // 10 דקות
    },
    
    getById: (productId) => {
      const key = `product_${productId}`;
      return memoryCache.get(key);
    },
    
    clear: () => {
      memoryCache.clearPattern('^products_');
      memoryCache.clearPattern('^product_');
    }
  },
  
  // cache לחיפושים
  search: {
    set: (query, results) => {
      const key = `search_${query}`;
      memoryCache.set(key, results, 1000 * 60 * 3); // 3 דקות
    },
    
    get: (query) => {
      const key = `search_${query}`;
      return memoryCache.get(key);
    },
    
    setSuggestions: (query, suggestions) => {
      const key = `suggestions_${query}`;
      memoryCache.set(key, suggestions, 1000 * 60); // דקה
    },
    
    getSuggestions: (query) => {
      const key = `suggestions_${query}`;
      return memoryCache.get(key);
    },
    
    clear: () => {
      memoryCache.clearPattern('^search_');
      memoryCache.clearPattern('^suggestions_');
    }
  },
  
  // cache למועדפים
  favorites: {
    set: (userId, favorites) => {
      const key = `favorites_${userId}`;
      memoryCache.set(key, favorites, 1000 * 60 * 10); // 10 דקות
    },
    
    get: (userId) => {
      const key = `favorites_${userId}`;
      return memoryCache.get(key);
    },
    
    addItem: (userId, productId) => {
      const favorites = memoryCache.get(`favorites_${userId}`) || [];
      if (!favorites.includes(productId)) {
        favorites.push(productId);
        memoryCache.set(`favorites_${userId}`, favorites, 1000 * 60 * 10);
      }
    },
    
    removeItem: (userId, productId) => {
      const favorites = memoryCache.get(`favorites_${userId}`) || [];
      const filtered = favorites.filter(id => id !== productId);
      memoryCache.set(`favorites_${userId}`, filtered, 1000 * 60 * 10);
    },
    
    clear: (userId) => {
      memoryCache.delete(`favorites_${userId}`);
    }
  },
  
  // cache למוכרים
  vendors: {
    set: (vendorId, data) => {
      const key = `vendor_${vendorId}`;
      memoryCache.set(key, data, 1000 * 60 * 15); // 15 דקות
    },
    
    get: (vendorId) => {
      const key = `vendor_${vendorId}`;
      return memoryCache.get(key);
    },
    
    setProducts: (vendorId, products, page = 1) => {
      const key = `vendor_${vendorId}_products_${page}`;
      memoryCache.set(key, products, 1000 * 60 * 5); // 5 דקות
    },
    
    getProducts: (vendorId, page = 1) => {
      const key = `vendor_${vendorId}_products_${page}`;
      return memoryCache.get(key);
    },
    
    clear: (vendorId) => {
      memoryCache.clearPattern(`^vendor_${vendorId}`);
    }
  },
  
  // ניקוי כללי
  clearAll: () => {
    memoryCache.clear();
  },
  
  // קבלת מידע על ה-cache
  getInfo: () => {
    return {
      size: memoryCache.size(),
      items: Array.from(memoryCache.cache.keys())
    };
  }
};

export default cacheService;