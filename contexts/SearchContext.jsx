// contexts/SearchContext.jsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchContext = createContext({});

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('price') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'relevance',
  });
  
  // Fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        const response = await axios.get(`/api/proxy/search/suggestions`, {
          params: { q: query }
        });
        
        if (response.data.success) {
          setSuggestions(response.data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );
  
  // Handle search
  const handleSearch = useCallback(async (query, customFilters = {}) => {
    if (!query && Object.keys(customFilters).length === 0) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams({
        q: query || searchQuery,
        ...filters,
        ...customFilters,
      });
      
      // Update URL
      router.push(`/products?${params.toString()}`);
      
      const response = await axios.get(`/api/proxy/search`, {
        params: Object.fromEntries(params)
      });
      
      if (response.data.success) {
        setSearchResults(response.data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters, router]);
  
  // Update search query
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    fetchSuggestions(query);
  }, [fetchSuggestions]);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchResults([]);
    setFilters({
      category: '',
      priceRange: '',
      rating: '',
      sort: 'relevance',
    });
    router.push('/products');
  }, [router]);
  
  // Select suggestion
  const selectSuggestion = useCallback((suggestion) => {
    if (suggestion.type === 'product') {
      router.push(`/product/${suggestion._id}`);
    } else if (suggestion.type === 'vendor') {
      router.push(`/vendor/${suggestion._id}`);
    } else if (suggestion.type === 'category') {
      handleSearch('', { category: suggestion.value });
    } else {
      setSearchQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
    setSuggestions([]);
  }, [router, handleSearch]);
  
  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Trigger new search with updated filters
    handleSearch(searchQuery, newFilters);
  }, [searchQuery, handleSearch]);
  
  // Listen to URL changes
  useEffect(() => {
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort');
    
    if (q !== searchQuery) {
      setSearchQuery(q || '');
    }
    
    setFilters({
      category: category || '',
      priceRange: price || '',
      rating: rating || '',
      sort: sort || 'relevance',
    });
  }, [searchParams]);
  
  const value = {
    // State
    searchQuery,
    suggestions,
    isSearching,
    searchResults,
    filters,
    
    // Actions
    updateSearchQuery,
    handleSearch,
    clearSearch,
    selectSuggestion,
    updateFilters,
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};