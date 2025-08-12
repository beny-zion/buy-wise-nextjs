// src/hooks/queries/useProductsQuery.js
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// פונקציות לבקשות API - עם נתיבים תקינים
const fetchProducts = async ({ pageParam = 1, limit = 20, filters = {} }) => {
  const { data } = await axios.get('/full-products', {  // ← תקן נתיב API
    params: {
      page: pageParam,
      limit,
      ...filters
    },
    withCredentials: true
  });
  return data;
};

const fetchProductById = async (productId) => {
  const { data } = await axios.get(`/full-products/${productId}`, {  // ← תקן נתיב API
    withCredentials: true
  });
  return data;
};

// הוק לטעינת מוצרים עם pagination אינסופי
export const useInfiniteProducts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam, limit: 20, filters }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (!pagination || !pagination.hasMore) return undefined;
      return pagination.currentPage + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 דקות
    cacheTime: 10 * 60 * 1000, // 10 דקות
    enabled: Object.keys(filters).length === 0, // רק אם אין פילטרים ספציפיים
  });
};

// הוק לטעינת מוצרים רגילה (עם pagination רגיל)
export const useProducts = (page = 1, limit = 20, filters = {}) => {
  return useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: () => fetchProducts({ pageParam: page, limit, filters }),
    keepPreviousData: true, // שמור על נתונים קודמים בזמן טעינה
    staleTime: 5 * 60 * 1000,
  });
};

// הוק לטעינת מוצר בודד
export const useProduct = (productId, options = {}) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 דקות למוצר בודד
    initialData: () => {
      // נסה למצוא את המוצר ב-cache של רשימת המוצרים
      const allProductsQueries = queryClient.getQueriesData(['products']);
      for (const [, data] of allProductsQueries) {
        if (data?.pages) {
          // infinite query
          for (const page of data.pages) {
            if (page?.products) {
              const found = page.products.find(p => p._id === productId);
              if (found) return { product: found };
            }
          }
        } else if (data?.products) {
          // regular query
          const found = data.products.find(p => p._id === productId);
          if (found) return { product: found };
        }
      }
      return undefined;
    },
    ...options
  });
};

// הוק לטעינת מוצרי מוכר
export const useVendorProducts = (vendorId, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['products', 'vendor', vendorId, page, limit],
    queryFn: () => fetchProducts({ 
      pageParam: page, 
      limit, 
      filters: { vendor: vendorId } 
    }),
    enabled: !!vendorId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// הוק לטעינת מוצרי קטגוריה
export const useCategoryProducts = (categoryId, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, page, limit],
    queryFn: () => fetchProducts({ 
      pageParam: page, 
      limit, 
      filters: { category: categoryId } 
    }),
    enabled: !!categoryId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// מוטציה לעדכון מוצר (למוכרים)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, updates }) => {
      const { data } = await axios.put(
        `/full-products/${productId}`,  // ← תקן נתיב API
        updates,
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (data, variables) => {
      // עדכן את המוצר ב-cache
      queryClient.setQueryData(['product', variables.productId], data);
      
      // רענן את רשימת המוצרים
      queryClient.invalidateQueries(['products']);
    },
  });
};

// פונקציות עזר
export const productsQueryUtils = {
  // טעינה מקדימה של מוצר
  prefetchProduct: async (queryClient, productId) => {
    await queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetchProductById(productId),
      staleTime: 10 * 60 * 1000,
    });
  },
  
  // עדכון מוצר ב-cache
  updateProductInCache: (queryClient, productId, updates) => {
    queryClient.setQueryData(['product', productId], old => ({
      ...old,
      ...updates
    }));
  },
  
  // ניקוי cache של מוצרים
  clearProductsCache: (queryClient) => {
    queryClient.invalidateQueries(['products']);
  },
};