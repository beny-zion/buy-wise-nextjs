'use client';

/* needed */
// components/search/SearchPanel.jsx - UPDATED VERSION (With vendor support)
import React, { useRef, useEffect, useState } from 'react';
import { Search, Filter, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';
import SearchSuggestions from './SearchSuggestions';
import SearchDrawer from './SearchDrawer';

const SearchPanel = () => {
  const {
    searchQuery,
    isSearching,
    showSuggestions,
    searchDrawerOpen,
    selectedCategory,
    selectedVendor,
    filterOptions,
    filters,
    updateSearchQuery,
    searchFreeText,
    setShowSuggestions,
    setSearchDrawerOpen,
    selectQuickCategory,
    selectVendor
  } = useSearch();
  
  const [showQuickCategories, setShowQuickCategories] = useState(false);
  const [showQuickVendors, setShowQuickVendors] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowQuickCategories(false);
        setShowQuickVendors(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);
  
  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('🔍 מבצע חיפוש טקסט חופשי מהפאנל:', searchQuery);
      
      setShowSuggestions(false);
      setShowQuickCategories(false);
      setShowQuickVendors(false);
      
      try {
        await searchFreeText();
        console.log('✅ חיפוש טקסט חופשי הושלם מהפאנל');
      } catch (error) {
        console.error('❌ שגיאה בחיפוש טקסט חופשי מהפאנל:', error);
      }
    }
  };
  
  // Handle input focus
  const handleInputFocus = () => {
    if (searchQuery) {
      setShowSuggestions(true);
    }
    setShowQuickCategories(true);
    setShowQuickVendors(true);
  };
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return filters.categories.length > 0 || 
           filters.vendors.length > 0 || 
           filters.priceRange.min !== null ||
           filters.priceRange.max !== null ||
           filters.minRating !== null;
  };
  
  return (
    <>
      <div className="relative" ref={searchRef}>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative flex items-center">
            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => updateSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="מה תרצה לחפש היום?"
              className="w-full h-10 pr-10 pl-14 bg-gray-50/80 border border-gray-200/60 rounded-2xl
                       text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA066]/40 focus:border-[#FFA066]/60
                       focus:bg-white focus:shadow-md transition-all duration-300 placeholder:text-gray-400
                       hover:bg-gray-50 hover:border-gray-300/80"
              dir="rtl"
            />
            
            {/* Search Icon */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            
            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  updateSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute left-11 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200/80 rounded-full transition-all duration-200"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            )}
            
            {/* Filter Button */}
            {/* <button
              type="button"
              onClick={() => setSearchDrawerOpen(true)}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200
                         ${hasActiveFilters() 
                           ? 'bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white shadow-lg' 
                           : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-700'}`}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters() && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button> */}
          </div>
          
          {/* Loading Indicator */}
          {isSearching && (
            <div className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gray-200 overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] animate-pulse rounded-full" />
            </div>
          )}
        </form>
        
        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <SearchSuggestions />
          )}
        </AnimatePresence>
        
        {/* Quick Categories & Vendors */}
        <AnimatePresence>
          {(showQuickCategories || showQuickVendors) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[72px] left-4 right-4 lg:left-[10%] lg:right-[10%] mt-3 bg-white/95 backdrop-blur-md rounded-2xl 
                         shadow-xl shadow-black/10 border border-gray-200/50 p-4 z-10 space-y-4 max-w-4xl mx-auto"
            >
              {/* Quick Categories */}
              {showQuickCategories && (
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-medium tracking-wide">קטגוריות מהירות</div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {/* All Products */}
                    <button
                      onClick={() => {
                        selectQuickCategory(null);
                        setShowQuickCategories(false);
                        setShowQuickVendors(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                                 ${!selectedCategory 
                                   ? 'bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white shadow-lg' 
                                   : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-700'}`}
                    >
                      כל המוצרים
                    </button>
                    
                    {/* Dynamic Categories */}
                    {filterOptions.categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          selectQuickCategory(category);
                          setShowQuickCategories(false);
                          setShowQuickVendors(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                                   flex items-center gap-2 group
                                   ${selectedCategory?.id === category.id 
                                     ? 'bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white shadow-lg' 
                                     : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-700'}`}
                      >
                        <span>{category.name}</span>
                        {category.count > 0 && (
                          <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">
                            {category.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 🆕 Quick Vendors */}
              {showQuickVendors && filterOptions.vendors.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-3 font-medium tracking-wide flex items-center gap-2">
                    <User className="w-3 h-3" />
                    מוכרים פעילים
                  </div>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {filterOptions.vendors.slice(0, 8).map(vendor => (
                      <button
                        key={vendor._id}
                        onClick={() => {
                          selectVendor(vendor);
                          setShowQuickCategories(false);
                          setShowQuickVendors(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
                                   flex items-center gap-2 group
                                   ${selectedVendor?._id === vendor._id 
                                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                     : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-700'}`}
                      >
                        <img
                          src={vendor.profileImage || '/default-avatar.png'}
                          alt={vendor.fullName}
                          className="w-5 h-5 rounded-full object-cover ring-2 ring-white/50"
                        />
                        <span>{vendor.fullName}</span>
                        {vendor.productCount > 0 && (
                          <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">
                            {vendor.productCount}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Search Drawer */}
      {/* <SearchDrawer /> */}
    </>
  );
};

export default SearchPanel;
