'use client';

// contexts/SearchContext.jsx - מנוע חיפוש פשוט
import React, { createContext, useState, useContext, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // סטייט חיפוש
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // ביצוע חיפוש
  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
        
        // הוספה להיסטוריה
        setSearchHistory(prev => {
          const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 5);
          return newHistory;
        });
        
        console.log('🔍 Search results:', data.products?.length || 0);
      } else {
        // נתונים דמיונליים אם השרת לא זמין
        const mockResults = generateMockSearchResults(query);
        setSearchResults(mockResults);
      }
    } catch (error) {
      console.log('Search error, using mock data:', error.message);
      const mockResults = generateMockSearchResults(query);
      setSearchResults(mockResults);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // ניווט לחיפוש
  const navigateToSearch = useCallback((query) => {
    setSearchQuery(query);
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }, [router]);

  // ניקוי חיפוש
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    router.push('/products');
  }, [router]);

  // עדכון שאילתת חיפוש
  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
    
    // חיפוש אוטומטי עם debounce
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const value = {
    // State
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    
    // Actions
    performSearch,
    navigateToSearch,
    clearSearch,
    updateSearchQuery,
    setSearchQuery,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// נתונים דמיונליים לחיפוש
function generateMockSearchResults(query) {
  const mockProducts = [
    'אוזניות בלוטוט',
    'כבל טעינה',
    'מטען אלחוטי',
    'מחזיק טלפון לרכב',
    'רמקול נייד',
    'מגן למחשב נייד',
    'עכבר אלחוטי',
    'מקלדת מכנית',
    'מצלמת רכב',
    'סוללה נייד'
  ];

  return mockProducts
    .filter(product => 
      product.includes(query) || 
      query.split(' ').some(word => product.includes(word))
    )
    .slice(0, 5)
    .map((title, index) => ({
      _id: `search-${index}`,
      title: `${title} - תוצאת חיפוש ל"${query}"`,
      image: `https://picsum.photos/200/200?random=${index + 100}`,
      price: Math.floor(Math.random() * 300) + 50,
      recommendation: `מוצר מעולה שמתאים לחיפוש "${query}"`,
      vendorId: {
        fullName: `ממליץ ${index + 1}`,
      }
    }));
}