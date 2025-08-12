/* needed */
// components/search/SearchDrawer.jsx - חדשני ומודרני
import React, { useState, useCallback, useMemo, memo } from 'react';
import { X, Filter, ChevronDown, Star, ShoppingBag, User, DollarSign, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';

// Memoized filter section component
const FilterSection = memo(({ 
  title, 
  icon: Icon, 
  accentColor, 
  isExpanded, 
  onToggle, 
  children,
  count = 0 
}) => {
  const sectionVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 }
  };
  
  return (
    <motion.div 
      className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden mb-4 shadow-lg"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-white/30 
                 transition-all group relative overflow-hidden"
      >
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${accentColor} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        <div className="flex items-center gap-4 relative z-10">
          <motion.div 
            className={`p-3 bg-gradient-to-br ${accentColor} rounded-2xl shadow-lg`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          <div className="text-left">
            <span className="font-bold text-gray-800 text-lg">{title}</span>
            {count > 0 && (
              <div className="text-xs text-gray-500 mt-0.5">{count} אפשרויות</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 relative z-10">
          {count > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 bg-gradient-to-r ${accentColor} text-white text-xs font-bold rounded-full shadow-md`}
            >
              {count}
            </motion.div>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={sectionVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FilterSection.displayName = 'FilterSection';

// Memoized category item
const CategoryItem = memo(({ category, isChecked, onChange, index }) => (
  <motion.label
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center gap-4 p-4 hover:bg-white/40 rounded-2xl 
             cursor-pointer transition-all group border border-transparent
             hover:border-white/30 hover:shadow-lg relative overflow-hidden"
  >
    {/* Background effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-5 h-5 text-[#FFA066] bg-white/80 border-2 border-gray-300 rounded-lg 
               focus:ring-[#FFA066] focus:ring-2 relative z-10"
    />
    <div className="text-3xl group-hover:scale-125 transition-transform relative z-10">
      {category.icon}
    </div>
    <div className="flex-1 relative z-10">
      <span className="text-sm font-semibold text-gray-800">{category.name}</span>
      <div className="text-xs text-gray-500 mt-0.5">זמין עכשיו</div>
    </div>
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full relative z-10"
    >
      {category.count}
    </motion.div>
  </motion.label>
));

CategoryItem.displayName = 'CategoryItem';

// Memoized vendor item
const VendorItem = memo(({ vendor, isChecked, onChange, index }) => (
  <motion.label
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center gap-4 p-4 hover:bg-white/40 rounded-2xl 
             cursor-pointer transition-all group border border-transparent
             hover:border-white/30 hover:shadow-lg relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-5 h-5 text-[#FFA066] bg-white/80 border-2 border-gray-300 rounded-lg 
               focus:ring-[#FFA066] focus:ring-2 relative z-10"
    />
    <div className="relative z-10">
      <motion.img
        src={vendor.profileImage || '/default-avatar.png'}
        alt={vendor.fullName}
        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white 
                 shadow-lg group-hover:ring-[#FFA066] transition-all"
        whileHover={{ scale: 1.1 }}
      />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 
                    rounded-full border-2 border-white shadow-md"></div>
    </div>
    <div className="flex-1 min-w-0 relative z-10">
      <span className="text-sm font-semibold text-gray-800 block truncate">
        {vendor.fullName}
      </span>
      <span className="text-xs text-gray-500 flex items-center gap-1">
        <ShoppingBag className="w-3 h-3" />
        {vendor.productCount} מוצרים
      </span>
    </div>
  </motion.label>
));

VendorItem.displayName = 'VendorItem';

// Main component
const SearchDrawer = memo(() => {
  const {
    searchDrawerOpen,
    filters,
    filterOptions,
    setSearchDrawerOpen,
    updateFilters,
    resetFilters,
    applyFilters
  } = useSearch();
  
  const [tempFilters, setTempFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    vendors: false,
    price: false,
    rating: false
  });
  
  // Update temp filters when drawer opens
  React.useEffect(() => {
    if (searchDrawerOpen) {
      setTempFilters(filters);
    }
  }, [searchDrawerOpen, filters]);
  
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);
  
  const handleCategoryToggle = useCallback((categoryId) => {
    setTempFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  }, []);
  
  const handleVendorToggle = useCallback((vendorId) => {
    setTempFilters(prev => ({
      ...prev,
      vendors: prev.vendors.includes(vendorId)
        ? prev.vendors.filter(id => id !== vendorId)
        : [...prev.vendors, vendorId]
    }));
  }, []);
  
  const handlePriceChange = useCallback((type, value) => {
    setTempFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value ? parseFloat(value) : null
      }
    }));
  }, []);
  
  const handleRatingChange = useCallback((rating) => {
    setTempFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? null : rating
    }));
  }, []);
  
  const handleApply = useCallback(async () => {
    try {
      await applyFilters(tempFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }, [tempFilters, applyFilters]);
  
  const handleReset = useCallback(() => {
    resetFilters();
    setTempFilters({
      categories: [],
      vendors: [],
      priceRange: { min: null, max: null },
      minRating: null,
      sort: 'relevance'
    });
  }, [resetFilters]);
  
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += tempFilters.categories.length;
    count += tempFilters.vendors.length;
    if (tempFilters.priceRange.min || tempFilters.priceRange.max) count++;
    if (tempFilters.minRating) count++;
    return count;
  }, [tempFilters]);
  
  if (!searchDrawerOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSearchDrawerOpen(false)}
        className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md z-[60]"
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-full max-w-md 
                 bg-gradient-to-br from-white/95 via-blue-50/30 to-purple-50/30 
                 backdrop-blur-xl shadow-2xl z-[61] flex flex-col overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-br from-[#FFA066] via-[#FF6B6B] to-[#8B5CF6] text-white p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">סינון חכם</h2>
                <p className="text-white/90 text-sm">גלה בדיוק מה שאתה מחפש</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white text-[#FFA066] text-sm font-bold px-4 py-2 rounded-2xl
                           shadow-lg min-w-[32px] text-center flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {activeFiltersCount}
                </motion.div>
              )}
              <motion.button
                onClick={() => setSearchDrawerOpen(false)}
                className="p-3 hover:bg-white/20 rounded-2xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-[#FFA066]/30 scrollbar-track-transparent">
          {/* Categories Section */}
          <FilterSection
            title="קטגוריות"
            icon={ShoppingBag}
            accentColor="from-blue-500 to-cyan-500"
            isExpanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
            count={filterOptions.categories?.length || 0}
          >
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filterOptions.categories?.map((category, index) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isChecked={tempFilters.categories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  index={index}
                />
              ))}
            </div>
          </FilterSection>
          
          {/* Vendors Section */}
          <FilterSection
            title="מוכרים"
            icon={User}
            accentColor="from-purple-500 to-pink-500"
            isExpanded={expandedSections.vendors}
            onToggle={() => toggleSection('vendors')}
            count={filterOptions.vendors?.length || 0}
          >
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filterOptions.vendors?.map((vendor, index) => (
                <VendorItem
                  key={vendor._id}
                  vendor={vendor}
                  isChecked={tempFilters.vendors.includes(vendor._id)}
                  onChange={() => handleVendorToggle(vendor._id)}
                  index={index}
                />
              ))}
            </div>
          </FilterSection>
          
          {/* Price Range Section */}
          <FilterSection
            title="טווח מחיר"
            icon={DollarSign}
            accentColor="from-green-500 to-emerald-500"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    מחיר מינימלי
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tempFilters.priceRange.min || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm
                             focus:ring-2 focus:ring-[#FFA066] focus:border-transparent
                             transition-all bg-white/80 backdrop-blur-sm
                             hover:bg-white hover:border-gray-300"
                  />
                </div>
                <div className="mt-8 px-2">
                  <span className="text-gray-400 font-bold text-lg">-</span>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    מחיר מקסימלי
                  </label>
                  <input
                    type="number"
                    placeholder="∞"
                    value={tempFilters.priceRange.max || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm
                             focus:ring-2 focus:ring-[#FFA066] focus:border-transparent
                             transition-all bg-white/80 backdrop-blur-sm
                             hover:bg-white hover:border-gray-300"
                  />
                </div>
              </div>
              {filterOptions.priceRange && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm"
                >
                  <div className="text-sm text-gray-700 text-center">
                    <span className="font-bold">טווח מחירים זמין:</span>
                    <br />
                    <span className="text-lg font-bold text-[#FFA066]">
                      ₪{filterOptions.priceRange.minPrice?.toLocaleString()} - 
                      ₪{filterOptions.priceRange.maxPrice?.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </FilterSection>
          
          {/* Rating Section */}
          <FilterSection
            title="דירוג מינימלי"
            icon={Star}
            accentColor="from-yellow-500 to-orange-500"
            isExpanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <motion.button
                  key={rating}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleRatingChange(rating)}
                  className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all
                             border-2 group hover:shadow-lg relative overflow-hidden
                             ${tempFilters.minRating === rating 
                               ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg' 
                               : 'hover:bg-white/60 border-transparent hover:border-white/30'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center gap-2 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Star
                          className={`w-6 h-6 transition-all duration-200 ${
                            i < rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 relative z-10">
                    {rating === 5 ? 'מעולה' : rating === 4 ? 'טוב מאוד' : 
                     rating === 3 ? 'טוב' : rating === 2 ? 'בסדר' : 'בסיסי'} ומעלה
                  </span>
                </motion.button>
              ))}
            </div>
          </FilterSection>
        </div>
        
        {/* Footer Actions */}
        <div className="shrink-0 bg-white/80 backdrop-blur-xl border-t border-white/50 p-5 shadow-lg">
          <div className="flex gap-3">
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 px-6 border-2 border-gray-200 text-gray-700 rounded-2xl
                       font-bold hover:bg-gray-50 hover:border-gray-300 transition-all
                       bg-white/80 backdrop-blur-sm"
            >
              איפוס הכל
            </motion.button>
            <motion.button
              onClick={handleApply}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-[2] py-4 px-8 bg-gradient-to-r from-[#FFA066] via-[#FF6B6B] to-[#8B5CF6] 
                       text-white rounded-2xl font-bold hover:shadow-xl 
                       transform hover:-translate-y-1 transition-all
                       relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                החל סינון
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C3D] via-[#FF5252] to-[#7C3AED] 
                            opacity-0 hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </div>
          {activeFiltersCount > 0 && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-gray-600 mt-3 font-medium"
            >
              🎯 {activeFiltersCount} פילטרים פעילים
            </motion.p>
          )}
        </div>
      </motion.div>
    </>
  );
});

SearchDrawer.displayName = 'SearchDrawer';

export default SearchDrawer;