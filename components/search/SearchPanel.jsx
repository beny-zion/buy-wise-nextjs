'use client';

// components/search/SearchPanel.jsx - פאנל חיפוש
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';

const SearchPanel = () => {
  const {
    searchQuery,
    searchResults,
    isSearching,
    searchHistory,
    updateSearchQuery,
    navigateToSearch,
    clearSearch,
    setSearchQuery
  } = useSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // סינכרון עם סטייט החיפוש
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // סגירה בלחיצה מחוץ לפאנל
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setIsOpen(true);
    
    // עדכון מיידי של הקונטקסט
    const cleanup = updateSearchQuery(value);
    return cleanup;
  };

  const handleSearch = (query = localQuery) => {
    if (query.trim()) {
      navigateToSearch(query.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    clearSearch();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleHistoryClick = (query) => {
    setLocalQuery(query);
    handleSearch(query);
  };

  const handleResultClick = (product) => {
    // ניווט לעמוד המוצר או חיפוש
    navigateToSearch(product.title);
    setIsOpen(false);
  };

  const showSuggestions = isOpen && (localQuery.length >= 2 || searchHistory.length > 0);

  return (
    <div className="relative w-full max-w-md" ref={panelRef}>
      {/* Input Box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search 
            size={20} 
            className="absolute right-3 text-gray-400 pointer-events-none z-10" 
          />
          
          <input
            ref={inputRef}
            type="text"
            placeholder="חפש מוצרים..."
            value={localQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsOpen(true)}
            className="w-full pr-12 pl-10 py-2.5 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                     bg-white text-gray-900 placeholder-gray-500 text-sm"
            dir="rtl"
          />
          
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute left-3 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          
          {/* טעינה */}
          {isSearching && localQuery.length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span>מחפש...</span>
              </div>
            </div>
          )}

          {/* תוצאות חיפוש */}
          {searchResults.length > 0 && (
            <div>
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TrendingUp size={16} />
                  <span>תוצאות</span>
                </div>
              </div>
              
              {searchResults.slice(0, 5).map((product, index) => (
                <button
                  key={product._id || index}
                  onClick={() => handleResultClick(product)}
                  className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 text-right border-b border-gray-50 last:border-b-0"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 text-right">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {product.title}
                    </div>
                    {product.price && (
                      <div className="text-xs text-orange-600 font-medium">
                        ₪{product.price}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* היסטוריית חיפושים */}
          {searchHistory.length > 0 && localQuery.length < 2 && (
            <div>
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock size={16} />
                  <span>חיפושים אחרונים</span>
                </div>
              </div>
              
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(query)}
                  className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 text-right"
                >
                  <Clock size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{query}</span>
                </button>
              ))}
            </div>
          )}

          {/* אין תוצאות */}
          {!isSearching && localQuery.length >= 2 && searchResults.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm">לא נמצאו תוצאות עבור "{localQuery}"</div>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                חפש בכל המוצרים
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;