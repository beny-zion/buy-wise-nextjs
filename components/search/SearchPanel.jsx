// components/search/SearchPanel.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';

const SearchPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Get initial search query from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowSuggestions(true);
      fetchSuggestions(value);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    setShowSuggestions(false);
    setIsSearching(true);
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    params.set('q', query);
    router.push(`/products?${params.toString()}`);
    
    setTimeout(() => setIsSearching(false), 500);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    
    if (suggestion.type === 'vendor') {
      router.push(`/vendor/${suggestion.id}`);
    } else if (suggestion.type === 'product') {
      router.push(`/product/${suggestion.id}`);
    } else {
      handleSearch(suggestion.text);
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
    
    // Remove search param from URL
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products');
  };

  return (
    <div className="relative w-full" ref={panelRef}>
      {/* Search Input */}
      <div className={`relative flex items-center bg-gray-50 rounded-xl transition-all ${
        isFocused ? 'ring-2 ring-[#FFA066]/30 bg-white' : ''
      }`}>
        {/* Search Icon */}
        <div className="absolute right-3 pointer-events-none">
          <Search className={`w-4 h-4 transition-colors ${
            isFocused ? 'text-[#FFA066]' : 'text-gray-400'
          }`} />
        </div>
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (searchQuery.trim()) setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
              inputRef.current?.blur();
            }
          }}
          placeholder="חיפוש מוצרים, מוכרים..."
          className="w-full py-2.5 pr-10 pl-8 bg-transparent text-sm text-gray-900 
                   placeholder-gray-400 outline-none"
          dir="rtl"
        />
        
        {/* Clear Button */}
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute left-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg 
                     border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 
                         transition-colors text-right border-b border-gray-50 last:border-0"
                dir="rtl"
              >
                {/* Icon based on type */}
                <div className={`p-2 rounded-lg ${
                  suggestion.type === 'vendor' ? 'bg-blue-50 text-blue-600' :
                  suggestion.type === 'product' ? 'bg-green-50 text-green-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  <Search className="w-3.5 h-3.5" />
                </div>
                
                {/* Text */}
                <div className="flex-1 text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.text}
                  </div>
                  {suggestion.subtitle && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {suggestion.subtitle}
                    </div>
                  )}
                </div>
                
                {/* Type Badge */}
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                  suggestion.type === 'vendor' ? 'bg-blue-100 text-blue-700' :
                  suggestion.type === 'product' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {suggestion.type === 'vendor' ? 'מוכר' :
                   suggestion.type === 'product' ? 'מוצר' :
                   'חיפוש'}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-[#FFA066] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchPanel;