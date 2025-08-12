// src/hooks/useProducts.js - 🚀 גרסה מאופטמזת 
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';
import { useMemo, useCallback } from 'react';
import axios from 'axios';

/**
 * 🎯 Hook מאופטמז לטעינת מוצרים
 * תיקונים:
 * 1. מניעת re-renders מיותרים עם useMemo
 * 2. קביעת query keys יציבים
 * 3. אופטימיזציה של dependency arrays
 * 4. הפרדת לוגיקה לפונקציות נפרדות
 */
export const useProducts = () => {
  const location = useLocation();
  const params = useParams();
  const { filters = {}, searchQuery = '', isSearchActive = false } = useSearch() || {};
  
  // 🎯 מניעת re-calculations מיותרים
  const memoizedParams = useMemo(() => params, [params?.vendorId, params?.id]);
  const memoizedFilters = useMemo(() => filters, [
    filters?.categories?.join(','),
    filters?.vendors?.join(','), 
    filters?.priceRange?.min,
    filters?.priceRange?.max,
    filters?.minRating,
    filters?.sort
  ]);
  
  // 🎯 בדיקה אם להשתמש במצב חיפוש - מחושבת פעם אחת
  const useSearchMode = useMemo(() => {
    if (memoizedParams?.vendorId) return true;
    if (searchQuery?.trim()) return true;
    if (isSearchActive) return true;
    if (memoizedFilters?.categories?.length > 0) return true;
    if (memoizedFilters?.vendors?.length > 0) return true;
    if (memoizedFilters?.priceRange?.min !== null || memoizedFilters?.priceRange?.max !== null) return true;
    if (memoizedFilters?.minRating !== null) return true;
    
    return false;
  }, [memoizedParams?.vendorId, searchQuery, isSearchActive, memoizedFilters]);
  
  // 🎯 בניית פרמטרים - מוקדש ויציב
  const queryParams = useMemo(() => {
    const baseParams = { limit: useSearchMode ? 50 : 12 };
    
    // מוכר מ-URL - עדיפות ראשונה
    if (memoizedParams?.vendorId) {
      baseParams.vendor = memoizedParams.vendorId;
    } else if (memoizedFilters?.vendors?.[0]) {
      baseParams.vendor = memoizedFilters.vendors[0];
    }
    
    // הוספת שאר הפרמטרים
    if (searchQuery?.trim()) baseParams.q = searchQuery.trim();
    if (memoizedFilters?.categories?.[0]) baseParams.category = memoizedFilters.categories[0];
    if (memoizedFilters?.priceRange?.min !== null) baseParams.minPrice = memoizedFilters.priceRange.min;
    if (memoizedFilters?.priceRange?.max !== null) baseParams.maxPrice = memoizedFilters.priceRange.max;
    if (memoizedFilters?.minRating !== null) baseParams.minRating = memoizedFilters.minRating;
    if (memoizedFilters?.sort && memoizedFilters.sort !== 'relevance') baseParams.sort = memoizedFilters.sort;
    
    return baseParams;
  }, [useSearchMode, memoizedParams?.vendorId, memoizedFilters, searchQuery]);
  
  // 🎯 Query Key יציב למניעת refetch מיותר
  const searchQueryKey = useMemo(() => [
    'products-search',
    JSON.stringify(queryParams)
  ], [queryParams]);
  
  const infiniteQueryKey = useMemo(() => [
    'products-infinite', 
    JSON.stringify(queryParams)
  ], [queryParams]);
  
  // 🎯 פונקציית fetch מוקדשת ומאופטמזת
  const fetchProducts = useCallback(async (params) => {
    try {
      const response = await axios.get('/full-products', {
        params,
        withCredentials: true
      });
      
      return {
        products: response.data?.products || [],
        pagination: response.data?.pagination || {},
        hasMore: response.data?.pagination?.hasMore || false
      };
    } catch (error) {
      console.error('❌ Products fetch error:', error);
      throw error;
    }
  }, []);
  
  // 🎯 Search Query - מאופטמז עם stale time טוב יותר
  const searchQueryResult = useQuery({
    queryKey: searchQueryKey,
    queryFn: () => fetchProducts(queryParams),
    enabled: useSearchMode,
    staleTime: 2 * 60 * 1000, // 2 דקות
    cacheTime: 10 * 60 * 1000, // 10 דקות
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true // 🎯 שמירת מוצרים קודמים בזמן טעינה
  });
  
  // 🎯 Infinite Query - מאופטמז
  const infiniteQuery = useInfiniteQuery({
    queryKey: infiniteQueryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const params = { ...queryParams, page: pageParam };
      const result = await fetchProducts(params);
      
      return {
        ...result,
        nextPage: result.pagination.hasMore ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !useSearchMode,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true
  });
  
  // 🎯 בחירת query פעיל
  const activeQuery = useSearchMode ? searchQueryResult : infiniteQuery;
  
  // 🎯 עיבוד נתונים מאופטמז
  const processedData = useMemo(() => {
    let products = [];
    
    if (useSearchMode) {
      products = searchQueryResult.data?.products || [];
    } else {
      const pages = infiniteQuery.data?.pages || [];
      products = pages.flatMap(page => page?.products || []);
    }
    
    // וידוא שזה מערך תקין
    return Array.isArray(products) ? products : [];
  }, [
    useSearchMode, 
    searchQueryResult.data?.products, 
    infiniteQuery.data?.pages
  ]);
  
  // 🎯 פונקציות מאופטמזות
  const loadMore = useCallback(() => {
    if (!useSearchMode && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
      infiniteQuery.fetchNextPage();
    }
  }, [useSearchMode, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage, infiniteQuery.fetchNextPage]);
  
  const refetch = useCallback(() => {
    activeQuery.refetch();
  }, [activeQuery]);
  
  // 🎯 החזרת נתונים מאופטמזת עם memoization
  return useMemo(() => ({
    // נתונים
    products: processedData,
    totalProducts: processedData.length,
    
    // מצב
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    error: activeQuery.error,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage || false,
    
    // יכולות
    hasMore: !useSearchMode && (infiniteQuery.hasNextPage || false),
    canLoadMore: !useSearchMode,
    
    // פונקציות
    loadMore,
    refetch,
    
    // מידע
    queryType: useSearchMode ? 'search' : 'all',
    isSearchMode: useSearchMode,
    
    // Performance info
    _performance: {
      cacheHit: activeQuery.isStale === false,
      queryKey: useSearchMode ? searchQueryKey : infiniteQueryKey,
      lastFetch: activeQuery.dataUpdatedAt
    }
  }), [
    processedData,
    activeQuery.isLoading,
    activeQuery.isError, 
    activeQuery.error,
    activeQuery.isStale,
    activeQuery.dataUpdatedAt,
    infiniteQuery.isFetchingNextPage,
    infiniteQuery.hasNextPage,
    useSearchMode,
    loadMore,
    refetch,
    searchQueryKey,
    infiniteQueryKey
  ]);
};

/**
 * 🎯 Hook מוצר בודד - מאופטמז
 */
export const useProduct = (productId) => {
  // 🎯 Query key יציב
  const queryKey = useMemo(() => ['product', productId], [productId]);
  
  // 🎯 Fetch function מוקדשת
  const fetchProduct = useCallback(async () => {
    if (!productId) return null;
    
    const response = await axios.get(`/full-products/${productId}`, {
      withCredentials: true
    });
    
    return response.data?.product || response.data;
  }, [productId]);
  
  return useQuery({
    queryKey,
    queryFn: fetchProduct,
    enabled: !!productId,
    staleTime: 15 * 60 * 1000, // 15 דקות לmוצר ספציפי
    cacheTime: 30 * 60 * 1000,
    retry: 2
  });
};

/**
 * 🎯 Hook מידע מוכר - מאופטמז
 */
export const useVendor = (vendorId) => {
  const queryKey = useMemo(() => ['vendor', vendorId], [vendorId]);
  
  const fetchVendor = useCallback(async () => {
    if (!vendorId) return null;
    
    try {
      // קבלת מוצר ראשון לקבלת מידע בסיסי
      const productsResponse = await axios.get('/full-products', {
        params: { vendor: vendorId, limit: 1 },
        withCredentials: true
      });
      
      const vendor = productsResponse.data?.products?.[0]?.vendorId;
      if (!vendor) return null;
      
      // קבלת סטטיסטיקות מלאות
      const statsResponse = await axios.get('/full-products', {
        params: { vendor: vendorId, limit: 100 },
        withCredentials: true
      });
      
      const products = statsResponse.data?.products || [];
      const ratings = products
        .map(p => p.aliExpressData?.rating || p.rating)
        .filter(r => r && r > 0);
      
      return {
        ...vendor,
        productCount: products.length,
        avgRating: ratings.length > 0 
          ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
          : null
      };
    } catch (error) {
      console.error('❌ Vendor fetch error:', error);
      return null;
    }
  }, [vendorId]);
  
  return useQuery({
    queryKey,
    queryFn: fetchVendor,
    enabled: !!vendorId,
    staleTime: 10 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    retry: 1
  });
};