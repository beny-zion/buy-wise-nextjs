// new
// src/contexts/ProductsDataContext.jsx
import React, { createContext, useContext } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ProductsDataContext = createContext();

export const ProductsDataProvider = ({ children }) => {
  const queryClient = useQueryClient();
  
  // שימוש ב-React Query לטעינת מוצרים
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get('/full-products', {
        params: { page: pageParam, limit: 12 },
        withCredentials: true
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.pagination?.hasMore) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 דקות
    cacheTime: 10 * 60 * 1000, // 10 דקות
  });

  // שטיחת כל העמודים למערך אחד
  const allProducts = data?.pages.flatMap(page => page.products || []) || [];
  
  // פונקציה לטעינת מוצר ספציפי
  const loadSpecificProduct = async (productId) => {
    try {
      // בדוק אם המוצר כבר קיים
      const existing = allProducts.find(p => p._id === productId);
      if (existing) return existing;
      
      // טען מהשרת
      const response = await axios.get(`/full-products/${productId}`, {
        withCredentials: true
      });
      
      if (response.data?.product) {
        return response.data.product;
      }
      return response.data;
    } catch (error) {
      console.error('Error loading specific product:', error);
      return null;
    }
  };
  
  // פונקציה לרענון נתונים
  const refreshProducts = () => {
    queryClient.invalidateQueries(['products']);
  };

  return (
    <ProductsDataContext.Provider value={{
      // נתונים
      allProducts,
      products: allProducts, // תאימות אחורה
      loading: isLoading,
      loadingMore: isFetchingNextPage,
      hasMore: hasNextPage,
      error: error?.message || null,
      
      // פונקציות
      loadMoreProducts: fetchNextPage,
      loadSpecificProduct,
      refetch,
      refreshProducts,
      
      // מידע נוסף
      totalProducts: allProducts.length,
      pages: data?.pages || []
    }}>
      {children}
    </ProductsDataContext.Provider>
  );
};

export const useProductsData = () => {
  const context = useContext(ProductsDataContext);
  if (!context) {
    throw new Error('useProductsData must be used within ProductsDataProvider');
  }
  return context;
};