// /* needed */
// // contexts/SearchContext.jsx - UPDATED VERSION (With vendor selection)
// import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { searchAPI } from '../services/api/search';
// import { debounce } from 'lodash';

// // Action types
// const SEARCH_ACTIONS = {
//   SET_QUERY: 'SET_QUERY',
//   SET_SUGGESTIONS: 'SET_SUGGESTIONS',
//   SET_LOADING: 'SET_LOADING',
//   SET_FILTERS: 'SET_FILTERS',
//   UPDATE_FILTER: 'UPDATE_FILTER',
//   SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',
//   SET_DRAWER_OPEN: 'SET_DRAWER_OPEN',
//   SET_SHOW_SUGGESTIONS: 'SET_SHOW_SUGGESTIONS',
//   SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
//   SET_SELECTED_VENDOR: 'SET_SELECTED_VENDOR',
//   RESET_SEARCH: 'RESET_SEARCH',
//   SET_ERROR: 'SET_ERROR',
//   SET_LAST_SEARCH_RESULTS: 'SET_LAST_SEARCH_RESULTS',
//   SET_CALLBACKS: 'SET_CALLBACKS'
// };

// // Initial state
// const initialState = {
//   // Search state
//   searchQuery: '',
//   suggestions: [],
//   isSearching: false,
//   showSuggestions: false,
//   searchDrawerOpen: false,
//   error: null,
//   lastSearchResults: [],
  
//   // Filters
//   filters: {
//     categories: [],
//     vendors: [],
//     priceRange: { min: null, max: null },
//     minRating: null,
//     sort: 'relevance'
//   },
  
//   // Filter options from server
//   filterOptions: {
//     categories: [],
//     vendors: [],
//     priceRange: { minPrice: 0, maxPrice: 1000 }
//   },
  
//   // Quick filters
//   selectedCategory: null,
//   selectedVendor: null,
  
//   // Callbacks
//   callbacks: {
//     handleSearchResults: null,
//     clearSearchAndLoadNormal: null,
//     setCategory: null
//   }
// };

// // Reducer
// function searchReducer(state, action) {
//   switch (action.type) {
//     case SEARCH_ACTIONS.SET_QUERY:
//       return { ...state, searchQuery: action.payload };
      
//     case SEARCH_ACTIONS.SET_SUGGESTIONS:
//       return { ...state, suggestions: action.payload };
      
//     case SEARCH_ACTIONS.SET_LOADING:
//       return { ...state, isSearching: action.payload };
      
//     case SEARCH_ACTIONS.SET_FILTERS:
//       return { ...state, filters: action.payload };
      
//     case SEARCH_ACTIONS.UPDATE_FILTER:
//       return {
//         ...state,
//         filters: { ...state.filters, ...action.payload }
//       };
      
//     case SEARCH_ACTIONS.SET_FILTER_OPTIONS:
//       return { ...state, filterOptions: action.payload };
      
//     case SEARCH_ACTIONS.SET_DRAWER_OPEN:
//       return { ...state, searchDrawerOpen: action.payload };
      
//     case SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS:
//       return { ...state, showSuggestions: action.payload };
      
//     case SEARCH_ACTIONS.SET_SELECTED_CATEGORY:
//       return { ...state, selectedCategory: action.payload };
      
//     case SEARCH_ACTIONS.SET_SELECTED_VENDOR:
//       return { ...state, selectedVendor: action.payload };
      
//     case SEARCH_ACTIONS.SET_ERROR:
//       return { ...state, error: action.payload };
      
//     case SEARCH_ACTIONS.SET_LAST_SEARCH_RESULTS:
//       return { ...state, lastSearchResults: action.payload };
      
//     case SEARCH_ACTIONS.SET_CALLBACKS:
//       return { 
//         ...state, 
//         callbacks: { ...state.callbacks, ...action.payload } 
//       };
      
//     case SEARCH_ACTIONS.RESET_SEARCH:
//       return {
//         ...initialState,
//         filterOptions: state.filterOptions,
//         callbacks: state.callbacks
//       };
      
//     default:
//       return state;
//   }
// }

// // Context
// const SearchContext = createContext(null);

// // Hook
// export const useSearch = () => {
//   const context = useContext(SearchContext);
//   if (!context) {
//     throw new Error('useSearch must be used within SearchProvider');
//   }
//   return context;
// };

// // Provider
// export const SearchProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(searchReducer, initialState);
//   const navigate = useNavigate();
  
//   // Load filter options on mount
//   useEffect(() => {
//     loadFilterOptions();
//   }, []);
  
//   // פונקציה לרישום callbacks מ-ProductViewer
//   const registerCallbacks = useCallback((callbacks) => {
//     console.log('🔗 רושם callbacks מ-ProductViewer');
//     dispatch({ 
//       type: SEARCH_ACTIONS.SET_CALLBACKS, 
//       payload: callbacks 
//     });
//   }, []);
  
//   // Load filter options
//   const loadFilterOptions = useCallback(async () => {
//     try {
//       const response = await searchAPI.getSearchData();
//       if (response.success) {
//         dispatch({ 
//           type: SEARCH_ACTIONS.SET_FILTER_OPTIONS, 
//           payload: response.data 
//         });
//       }
//     } catch (error) {
//       console.error('Error loading filter options:', error);
//       dispatch({ 
//         type: SEARCH_ACTIONS.SET_ERROR, 
//         payload: 'שגיאה בטעינת אפשרויות סינון' 
//       });
//     }
//   }, []);
  
//   // פונקציה לחיפוש טקסט חופשי
//   const searchFreeText = useCallback(async (query = null) => {
//     const searchText = query || state.searchQuery;
    
//     if (!searchText.trim()) {
//       console.log('❌ חיפוש טקסט חופשי ללא טקסט');
//       return;
//     }
    
//     console.log('🔍 מתחיל חיפוש טקסט חופשי:', searchText);
    
//     dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true });
//     dispatch({ type: SEARCH_ACTIONS.SET_ERROR, payload: null });
    
//     try {
//       const searchParams = {
//         q: searchText,
//         page: 1,
//         limit: 20
//       };
      
//       const response = await searchAPI.searchProducts(searchParams);
      
//       if (response.success && response.products) {
//         console.log('✅ חיפוש טקסט חופשי הושלם בהצלחה:', response.products.length, 'מוצרים');
        
//         dispatch({ 
//           type: SEARCH_ACTIONS.SET_LAST_SEARCH_RESULTS, 
//           payload: response.products 
//         });
        
//         if (state.callbacks.handleSearchResults) {
//           state.callbacks.handleSearchResults(response.products, searchParams);
//         }
        
//         return response;
//       } else {
//         console.log('❌ לא נמצאו תוצאות לחיפוש טקסט חופשי');
        
//         dispatch({ 
//           type: SEARCH_ACTIONS.SET_LAST_SEARCH_RESULTS, 
//           payload: [] 
//         });
        
//         if (state.callbacks.handleSearchResults) {
//           state.callbacks.handleSearchResults([], searchParams);
//         }
        
//         return response;
//       }
//     } catch (error) {
//       console.error('❌ שגיאה בחיפוש טקסט חופשי:', error);
      
//       dispatch({ 
//         type: SEARCH_ACTIONS.SET_ERROR, 
//         payload: error.message || 'שגיאה בחיפוש טקסט חופשי' 
//       });
      
//       if (state.callbacks.handleSearchResults) {
//         state.callbacks.handleSearchResults([], null);
//       }
      
//       throw error;
//     } finally {
//       dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: false });
//     }
//   }, [state.searchQuery, state.callbacks]);
  
//   // Main search function
//   const searchProducts = useCallback(async (customFilters = null) => {
//     console.log('🔍 מתחיל חיפוש מוצרים עם פילטרים');
    
//     dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true });
//     dispatch({ type: SEARCH_ACTIONS.SET_ERROR, payload: null });
    
//     try {
//       const filtersToUse = customFilters || state.filters;
//       const searchParams = {
//         q: state.searchQuery,
//         ...filtersToUse,
//         page: 1,
//         limit: 20
//       };
      
//       // Remove empty values
//       Object.keys(searchParams).forEach(key => {
//         const value = searchParams[key];
        
//         if (!value || 
//             (Array.isArray(value) && value.length === 0) ||
//             (typeof value === 'object' && value !== null && !Array.isArray(value) && 
//              !value.min && !value.max)) {
//           delete searchParams[key];
//         }
//       });
      
//       const response = await searchAPI.searchProducts(searchParams);
      
//       if (response.success && response.products) {
//         dispatch({ 
//           type: SEARCH_ACTIONS.SET_LAST_SEARCH_RESULTS, 
//           payload: response.products 
//         });
        
//         if (state.callbacks.handleSearchResults) {
//           state.callbacks.handleSearchResults(response.products, searchParams);
//         }
        
//         return response;
//       } else {
//         dispatch({ 
//           type: SEARCH_ACTIONS.SET_LAST_SEARCH_RESULTS, 
//           payload: [] 
//         });
        
//         if (state.callbacks.handleSearchResults) {
//           state.callbacks.handleSearchResults([], searchParams);
//         }
        
//         return response;
//       }
//     } catch (error) {
//       console.error('❌ שגיאה בחיפוש עם פילטרים:', error);
      
//       dispatch({ 
//         type: SEARCH_ACTIONS.SET_ERROR, 
//         payload: error.message || 'שגיאה בחיפוש' 
//       });
      
//       if (state.callbacks.handleSearchResults) {
//         state.callbacks.handleSearchResults([], null);
//       }
      
//       throw error;
//     } finally {
//       dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: false });
//     }
//   }, [state.searchQuery, state.filters, state.callbacks]);
  
//   // Debounced suggestion fetcher
//   const fetchSuggestions = useMemo(
//     () => debounce(async (query) => {
//       if (!query || query.length < 2) {
//         dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] });
//         return;
//       }
      
//       try {
//         const response = await searchAPI.getSuggestions(query);
//         if (response.success) {
//           dispatch({ 
//             type: SEARCH_ACTIONS.SET_SUGGESTIONS, 
//             payload: response.suggestions 
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//       }
//     }, 300),
//     []
//   );
  
//   // Update search query
//   const updateSearchQuery = useCallback((query) => {
//     dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query });
    
//     if (query) {
//       fetchSuggestions(query);
//       dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
//     } else {
//       dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] });
//       dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
//     }
//   }, [fetchSuggestions]);
  
//   // Select quick category
//   const selectQuickCategory = useCallback(async (category) => {
//     console.log('📂 בוחר קטגוריה מהירה:', category?.name || 'כל המוצרים');
    
//     dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: category });
//     dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
    
//     if (category) {
//       const newFilters = {
//         ...state.filters,
//         categories: [category.id],
//         vendors: []
//       };
      
//       dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
//       await searchProducts(newFilters);
//     } else {
//       await clearSearch();
//     }
//   }, [state.filters, searchProducts]);
  
//   // 🆕 Select vendor - הפונקציה החדשה
//   const selectVendor = useCallback(async (vendor) => {
//     console.log('👤 בוחר מוכר:', vendor?.fullName || 'כל המוכרים');
    
//     if (vendor) {
//       // עדכון ה-state
//       dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: vendor });
//       dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
      
//       // עדכון הפילטרים
//       const newFilters = {
//         ...state.filters,
//         vendors: [vendor._id],
//         categories: []
//       };
      
//       dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
      
//       // עדכון URL
//       navigate(`/vendor/${vendor._id}`);
      
//       // חיפוש מוצרי המוכר
//       await searchProducts(newFilters);
//     } else {
//       // איפוס המוכר
//       dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
//       await clearSearch();
//     }
//   }, [state.filters, searchProducts, navigate]);
  
//   // בחירת הצעה עם איפוס פילטרים
//   const selectSuggestion = useCallback(async (suggestion) => {
//     console.log('💡 בוחר הצעה:', suggestion.text, 'סוג:', suggestion.type);
    
//     dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
//     dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: suggestion.text });
    
//     if (suggestion.type === 'vendor') {
//       // אם זה מוכר, בחר את המוכר
//       const vendor = state.filterOptions.vendors.find(v => v._id === suggestion.id);
//       if (vendor) {
//         await selectVendor(vendor);
//       }
//     } else {
//       // איפוס כל הפילטרים לפני החיפוש
//       const cleanFilters = {
//         categories: [],
//         vendors: [],
//         priceRange: { min: null, max: null },
//         minRating: null,
//         sort: 'relevance'
//       };
      
//       dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: cleanFilters });
//       dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
//       dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
      
//       // ביצוע חיפוש טקסט חופשי
//       await searchFreeText(suggestion.text);
//     }
    
//     return suggestion;
//   }, [searchFreeText, selectVendor, state.filterOptions.vendors]);
  
//   // Update filters
//   const updateFilters = useCallback((newFilters) => {
//     dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
//   }, []);
  
//   // Apply filters
//   const applyFilters = useCallback(async (customFilters = null) => {
//     try {
//       const filtersToUse = customFilters || state.filters;
      
//       if (customFilters) {
//         dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: customFilters });
//       }
      
//       await searchProducts(filtersToUse);
//       dispatch({ type: SEARCH_ACTIONS.SET_DRAWER_OPEN, payload: false });
//     } catch (error) {
//       dispatch({ 
//         type: SEARCH_ACTIONS.SET_ERROR, 
//         payload: 'שגיאה בהחלת הפילטרים' 
//       });
//     }
//   }, [searchProducts, state.filters]);
  
//   // Clear search
//   const clearSearch = useCallback(async () => {
//     console.log('🧹 מנקה חיפוש מלא');
    
//     // איפוס SearchContext
//     dispatch({ type: SEARCH_ACTIONS.RESET_SEARCH });
    
//     // עדכון URL לעמוד הראשי
//     navigate('/products');
    
//     // איפוס ProductViewerContext
//     if (state.callbacks.clearSearchAndLoadNormal) {
//       await state.callbacks.clearSearchAndLoadNormal();
//     }
    
//     console.log('✅ חיפוש נוקה בהצלחה');
//   }, [state.callbacks, navigate]);
  
//   // Reset filters only
//   const resetFilters = useCallback(() => {
//     dispatch({ 
//       type: SEARCH_ACTIONS.SET_FILTERS, 
//       payload: initialState.filters 
//     });
//     dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
//     dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
//   }, []);
  
//   // Memoized value
//   const value = useMemo(() => ({
//     // State
//     ...state,
    
//     // Computed values
//     isSearchActive: !!(state.searchQuery || 
//                       state.filters.categories.length > 0 ||
//                       state.filters.vendors.length > 0 ||
//                       state.filters.priceRange.min !== null ||
//                       state.filters.priceRange.max !== null ||
//                       state.filters.minRating !== null),
    
//     // Actions
//     updateSearchQuery,
//     searchProducts,
//     searchFreeText,
//     selectSuggestion,
//     selectVendor, // 🆕 הפונקציה החדשה
//     setShowSuggestions: (show) => dispatch({ 
//       type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, 
//       payload: show 
//     }),
//     setSearchDrawerOpen: (open) => dispatch({ 
//       type: SEARCH_ACTIONS.SET_DRAWER_OPEN, 
//       payload: open 
//     }),
//     selectQuickCategory,
//     updateFilters,
//     resetFilters,
//     applyFilters,
//     loadFilterOptions,
//     clearSearch,
    
//     // Callback registration
//     registerCallbacks
//   }), [
//     state,
//     updateSearchQuery,
//     searchProducts,
//     searchFreeText,
//     selectSuggestion,
//     selectVendor,
//     selectQuickCategory,
//     updateFilters,
//     resetFilters,
//     applyFilters,
//     loadFilterOptions,
//     clearSearch,
//     registerCallbacks
//   ]);
  
//   return (
//     <SearchContext.Provider value={value}>
//       {children}
//     </SearchContext.Provider>
//   );
// };
// src/contexts/SearchContext.jsx - גרסה ללא לופים אינסופיים
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api/search';
import { debounce } from 'lodash';

// Action types
const SEARCH_ACTIONS = {
  SET_QUERY: 'SET_QUERY',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_LOADING: 'SET_LOADING',
  SET_FILTERS: 'SET_FILTERS',
  UPDATE_FILTER: 'UPDATE_FILTER',
  SET_FILTER_OPTIONS: 'SET_FILTER_OPTIONS',
  SET_DRAWER_OPEN: 'SET_DRAWER_OPEN',
  SET_SHOW_SUGGESTIONS: 'SET_SHOW_SUGGESTIONS',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_SELECTED_VENDOR: 'SET_SELECTED_VENDOR',
  RESET_SEARCH: 'RESET_SEARCH',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  searchQuery: '',
  suggestions: [],
  isSearching: false,
  showSuggestions: false,
  searchDrawerOpen: false,
  error: null,
  
  filters: {
    categories: [],
    vendors: [],
    priceRange: { min: null, max: null },
    minRating: null,
    sort: 'relevance'
  },
  
  filterOptions: {
    categories: [],
    vendors: [],
    priceRange: { minPrice: 0, maxPrice: 1000 }
  },
  
  selectedCategory: null,
  selectedVendor: null
};

// Reducer
function searchReducer(state, action) {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_QUERY:
      return { ...state, searchQuery: action.payload };
      
    case SEARCH_ACTIONS.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload };
      
    case SEARCH_ACTIONS.SET_LOADING:
      return { ...state, isSearching: action.payload };
      
    case SEARCH_ACTIONS.SET_FILTERS:
      return { ...state, filters: action.payload };
      
    case SEARCH_ACTIONS.UPDATE_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
      
    case SEARCH_ACTIONS.SET_FILTER_OPTIONS:
      return { ...state, filterOptions: action.payload };
      
    case SEARCH_ACTIONS.SET_DRAWER_OPEN:
      return { ...state, searchDrawerOpen: action.payload };
      
    case SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS:
      return { ...state, showSuggestions: action.payload };
      
    case SEARCH_ACTIONS.SET_SELECTED_CATEGORY:
      return { ...state, selectedCategory: action.payload };
      
    case SEARCH_ACTIONS.SET_SELECTED_VENDOR:
      return { ...state, selectedVendor: action.payload };
      
    case SEARCH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
      
    case SEARCH_ACTIONS.RESET_SEARCH:
      return {
        ...initialState,
        filterOptions: state.filterOptions
      };
      
    default:
      return state;
  }
}

const SearchContext = createContext(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

/**
 * 🛑 SearchProvider מתוקן - מונע לופים אינסופיים
 */
export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();
  
  // 🛑 רפס למניעת לופים
  const lastSelectedVendorId = useRef(null);
  const processingVendorSelection = useRef(false);
  
  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);
  
  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await searchAPI.getSearchData();
      if (response.success) {
        dispatch({ 
          type: SEARCH_ACTIONS.SET_FILTER_OPTIONS, 
          payload: response.data 
        });
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
      dispatch({ 
        type: SEARCH_ACTIONS.SET_ERROR, 
        payload: 'שגיאה בטעינת אפשרויות סינון' 
      });
    }
  }, []);
  
  // Debounced suggestion fetcher
  const fetchSuggestions = useMemo(
    () => debounce(async (query) => {
      if (!query || query.length < 2) {
        dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] });
        return;
      }
      
      try {
        const response = await searchAPI.getSuggestions(query);
        if (response.success) {
          dispatch({ 
            type: SEARCH_ACTIONS.SET_SUGGESTIONS, 
            payload: response.suggestions 
          });
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300),
    []
  );
  
  const updateSearchQuery = useCallback((query) => {
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query });
    
    if (query) {
      fetchSuggestions(query);
      dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: true });
    } else {
      dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] });
      dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
    }
  }, [fetchSuggestions]);
  
  const searchProducts = useCallback(async (customFilters = null) => {
    console.log('🔍 SearchContext: searchProducts called');
    const filtersToUse = customFilters || state.filters;
    
    if (customFilters) {
      dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: customFilters });
    }
    
    dispatch({ type: SEARCH_ACTIONS.SET_DRAWER_OPEN, payload: false });
  }, [state.filters]);
  
  // const searchFreeText = useCallback(async (query = null) => {
  //   const searchText = query || state.searchQuery;
    
  //   if (!searchText.trim()) {
  //     console.log('❌ Empty search query');
  //     return;
  //   }
    
  //   console.log('🔍 SearchContext: searchFreeText:', searchText);
  //   dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: searchText });
  //   dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true });
    
  //   setTimeout(() => {
  //     dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: false });
  //   }, 100);
  // }, [state.searchQuery]);
  const searchFreeText = useCallback(async (query = null) => {
  const searchText = query || state.searchQuery;
  
  if (!searchText.trim()) {
    console.log('❌ Empty search query');
    return;
  }
  
  console.log('🔍 SearchContext: searchFreeText:', searchText);
  
  // איפוס סינונים קודמים
  dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
  dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
  dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: {
    categories: [],
    vendors: [],
    priceRange: { min: null, max: null },
    minRating: null,
    sort: 'relevance'
  }});
  
  // הגדרת הטקסט
  dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: searchText });
  
  // ניווט לעמוד המוצרים
  navigate('/products');
  
  console.log('✅ חיפוש חופשי הוגדר:', searchText);
}, [state.searchQuery, navigate]);
  
  // const selectQuickCategory = useCallback(async (category) => {
  //   console.log('📂 SearchContext: selectQuickCategory:', category?.name || 'הכל');
    
  //   dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: category });
  //   dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
    
  //   if (category) {
  //     const newFilters = {
  //       ...state.filters,
  //       categories: [category.id],
  //       vendors: []
  //     };
      
  //     dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
  //   } else {
  //     await clearSearch();
  //   }
  // }, [state.filters]);
  // תיקון פונקציה selectQuickCategory ב-SearchContext.jsx
// תיקון פונקציות selectQuickCategory ו-selectVendor ב-SearchContext.jsx

// 🔧 תיקון selectQuickCategory - להוסיף ניקוי searchQuery
const selectQuickCategory = useCallback(async (category) => {
  console.log('📂 SearchContext: selectQuickCategory:', category?.name || 'הכל');
  
  dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: category });
  dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
  
  if (category) {
    // 🔧 **תיקון: ניקוי תיבת החיפוש כאשר בוחרים קטגוריה**
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: '' });
    
    const newFilters = {
      ...state.filters,
      categories: [category.id],
      vendors: []
    };
    
    dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
    navigate('/products');
    
  } else {
    await clearSearch();
  }
}, [state.filters, navigate]);

// 🔧 תיקון selectVendor - להוסיף ניקוי searchQuery
const selectVendor = useCallback(async (vendor) => {
  // מניעת לופים אינסופיים
  if (processingVendorSelection.current) {
    console.log('🛑 Already processing vendor selection, skipping...');
    return;
  }
  
  if (vendor && vendor._id === lastSelectedVendorId.current) {
    console.log('🛑 Vendor already selected, skipping...', vendor._id);
    return;
  }
  
  console.log('👤 SearchContext: selectVendor:', vendor?.fullName || 'הכל');
  
  if (vendor) {
    processingVendorSelection.current = true;
    lastSelectedVendorId.current = vendor._id;
    
    // 🔧 **תיקון: ניקוי תיבת החיפוש כאשר בוחרים מוכר**
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: '' });
    
    // עדכון state
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: vendor });
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
    
    // עדכון פילטרים
    const newFilters = {
      ...state.filters,
      vendors: [vendor._id],
      categories: []
    };
    
    dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
    
    // עדכון URL רק אם צריך
    const currentPath = window.location.pathname;
    if (!currentPath.includes(`/vendor/${vendor._id}`)) {
      console.log('🧭 Navigating to vendor:', vendor._id);
      navigate(`/vendor/${vendor._id}`);
    }
    
    // שחרר נעילה
    setTimeout(() => {
      processingVendorSelection.current = false;
    }, 1000);
  } else {
    // איפוס מוכר
    lastSelectedVendorId.current = null;
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
    await clearSearch();
  }
}, [state.filters, navigate]);
  
  // const selectSuggestion = useCallback(async (suggestion) => {
  //   console.log('💡 SearchContext: selectSuggestion:', suggestion.text);
    
  //   dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
  //   dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: suggestion.text });
    
  //   if (suggestion.type === 'vendor') {
  //     const vendor = state.filterOptions.vendors.find(v => v._id === suggestion.id);
  //     if (vendor) {
  //       await selectVendor(vendor);
  //     }
  //   } else {
  //     await searchFreeText(suggestion.text);
  //   }
  // }, [searchFreeText, selectVendor, state.filterOptions.vendors]);
  
  const updateFilters = useCallback((newFilters) => {
    dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);
const selectSuggestion = useCallback(async (suggestion) => {
  console.log('💡 SearchContext: selectSuggestion:', suggestion.text);
  
  dispatch({ type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, payload: false });
  
  if (suggestion.type === 'vendor') {
    // כאשר בוחרים מוכר - ננקה את תיבת החיפוש ונעבור למוכר
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: '' });
    
    const vendor = state.filterOptions.vendors.find(v => v._id === suggestion.id);
    if (vendor) {
      await selectVendor(vendor);
    }
  } else {
    // 🔧 **תיקון: עבור מוצרים וקטגוריות - נווט לעמוד חיפוש**
    
    // איפוס כל הסינונים הקודמים
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
    dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: {
      categories: [],
      vendors: [],
      priceRange: { min: null, max: null },
      minRating: null,
      sort: 'relevance'
    }});
    
    // הגדרת הטקסט לחיפוש
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: suggestion.text });
    
    // ניווט לעמוד המוצרים
    navigate('/products');
    
    console.log('✅ חיפוש הוגדר:', suggestion.text);
  }
}, [selectVendor, state.filterOptions.vendors, navigate]);
  
  const applyFilters = useCallback(async (customFilters = null) => {
    const filtersToUse = customFilters || state.filters;
    
    if (customFilters) {
      dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: customFilters });
    }
    
    dispatch({ type: SEARCH_ACTIONS.SET_DRAWER_OPEN, payload: false });
  }, [state.filters]);
  
  const clearSearch = useCallback(async () => {
    console.log('🧹 SearchContext: clearSearch');
    
    // איפוס refs
    lastSelectedVendorId.current = null;
    processingVendorSelection.current = false;
    
    dispatch({ type: SEARCH_ACTIONS.RESET_SEARCH });
    navigate('/products');
  }, [navigate]);
  
  const resetFilters = useCallback(() => {
    dispatch({ 
      type: SEARCH_ACTIONS.SET_FILTERS, 
      payload: initialState.filters 
    });
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_CATEGORY, payload: null });
    dispatch({ type: SEARCH_ACTIONS.SET_SELECTED_VENDOR, payload: null });
  }, []);
  
  // Computed value
  const isSearchActive = !!(state.searchQuery || 
                          state.filters.categories.length > 0 ||
                          state.filters.vendors.length > 0 ||
                          state.filters.priceRange.min !== null ||
                          state.filters.priceRange.max !== null ||
                          state.filters.minRating !== null);
  
  // Memoized value
  const value = useMemo(() => ({
    // State
    ...state,
    isSearchActive,
    
    // Actions
    updateSearchQuery,
    searchProducts,
    searchFreeText,
    selectSuggestion,
    selectVendor,
    setShowSuggestions: (show) => dispatch({ 
      type: SEARCH_ACTIONS.SET_SHOW_SUGGESTIONS, 
      payload: show 
    }),
    setSearchDrawerOpen: (open) => dispatch({ 
      type: SEARCH_ACTIONS.SET_DRAWER_OPEN, 
      payload: open 
    }),
    selectQuickCategory,
    updateFilters,
    resetFilters,
    applyFilters,
    loadFilterOptions,
    clearSearch,
    
    // Deprecated
    registerCallbacks: () => console.log('Deprecated: registerCallbacks')
  }), [
    state,
    isSearchActive,
    updateSearchQuery,
    searchProducts,
    searchFreeText,
    selectSuggestion,
    selectVendor,
    selectQuickCategory,
    updateFilters,
    resetFilters,
    applyFilters,
    loadFilterOptions,
    clearSearch
  ]);
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};