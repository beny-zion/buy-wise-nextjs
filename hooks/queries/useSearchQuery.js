// src/hooks/queries/useSearchQuery.js
import { useQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

// פונקציות API
const searchProducts = async ({ query, filters = {} }) => {
  const { data } = await axios.get('/api/search', {
    params: {
      q: query,
      ...filters
    },
    withCredentials: true
  });
  return data;
};

const fetchSearchSuggestions = async (query) => {
  const { data } = await axios.get('/api/search/suggestions', {
    params: { q: query },
    withCredentials: true
  });
  return data;
};

const fetchSearchFilters = async () => {
  const { data } = await axios.get('/api/search/filters', {
    withCredentials: true
  });
  return data;
};

// הוק לחיפוש מוצרים
export const useSearch = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  
  // שימוש ב-query לחיפוש
  const searchResults = useQuery({
    queryKey: ['search', searchQuery, filters],
    queryFn: () => searchProducts({ query: searchQuery, filters }),
    enabled: searchQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 דקות
    cacheTime: 10 * 60 * 1000, // 10 דקות
  });
  
  // פונקציה לביצוע חיפוש
  const performSearch = useCallback((query, newFilters = {}) => {
    setSearchQuery(query);
    setFilters(newFilters);
  }, []);
  
  // ניקוי חיפוש
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    queryClient.removeQueries(['search']);
  }, [queryClient]);
  
  return {
    searchQuery,
    filters,
    results: searchResults.data,
    isLoading: searchResults.isLoading,
    error: searchResults.error,
    performSearch,
    clearSearch,
    setFilters,
  };
};

// הוק להצעות חיפוש
export const useSearchSuggestions = (enabled = true) => {
  const [query, setQuery] = useState('');
  
  // Debounce של שאילתת החיפוש
  const debouncedSetQuery = useCallback(
    debounce((newQuery) => {
      setQuery(newQuery);
    }, 300),
    []
  );
  
  const { data, isLoading } = useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: () => fetchSearchSuggestions(query),
    enabled: enabled && query.length >= 2,
    staleTime: 60 * 1000, // דקה אחת
  });
  
  return {
    suggestions: data?.suggestions || [],
    isLoading,
    setSuggestionsQuery: debouncedSetQuery,
  };
};

// הוק לפילטרים של חיפוש
export const useSearchFilters = () => {
  return useQuery({
    queryKey: ['search', 'filters'],
    queryFn: fetchSearchFilters,
    staleTime: 30 * 60 * 1000, // 30 דקות - פילטרים לא משתנים הרבה
    cacheTime: 60 * 60 * 1000, // שעה
  });
};

// הוק לשמירת חיפושים אחרונים
export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });
  
  const addRecentSearch = useCallback((query) => {
    if (!query || query.length < 2) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== query);
      const updated = [query, ...filtered].slice(0, 10); // שמור רק 10 אחרונים
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);
  
  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
};

// מוטציה לשמירת חיפוש (אנליטיקס)
export const useSaveSearchAnalytics = () => {
  return useMutation({
    mutationFn: async ({ query, resultsCount }) => {
      await axios.post('/api/search/analytics', {
        query,
        resultsCount,
        timestamp: new Date().toISOString()
      }, {
        withCredentials: true
      });
    },
  });
};

// פונקציות עזר
export const searchQueryUtils = {
  // טעינה מקדימה של הצעות
  prefetchSuggestions: async (queryClient, query) => {
    await queryClient.prefetchQuery({
      queryKey: ['search', 'suggestions', query],
      queryFn: () => fetchSearchSuggestions(query),
      staleTime: 60 * 1000,
    });
  },
  
  // בדיקה אם יש תוצאות ב-cache
  hasSearchResults: (queryClient, query, filters = {}) => {
    const data = queryClient.getQueryData(['search', query, filters]);
    return !!data;
  },
  
  // ניקוי cache של חיפוש
  clearSearchCache: (queryClient) => {
    queryClient.removeQueries(['search']);
  },
};