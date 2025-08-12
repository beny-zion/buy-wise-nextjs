// // /* needed */
// // // contexts/ProductViewerContext.jsx - UPDATED VERSION (With vendor filtering support + URL fix)
// // import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import axios from 'axios';
// // import { useAuth } from './AuthContext';
// // import { favoritesService } from '../services/api/favorites';
// // import { analyticsService } from '../services/api/analytics';

// // const ProductViewerContext = createContext(null);
// // const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// // export const useProductViewer = () => {
// //   const context = useContext(ProductViewerContext);
// //   if (!context) {
// //     throw new Error('useProductViewer חייב להיות בתוך ProductViewerProvider');
// //   }
// //   return context;
// // };

// // export const ProductViewerProvider = ({ 
// //   children, 
// //   apiBaseUrl = API_BASE_URL,
// //   initialCategory = null
// // }) => {
// //   // מצב בסיסי
// //   const [allProducts, setAllProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [loadingMore, setLoadingMore] = useState(false);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [favoriteIds, setFavoriteIds] = useState(new Set());
// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
  
// //   // מצב חיפוש
// //   const [searchMode, setSearchMode] = useState(false);
// //   const [lastSearchParams, setLastSearchParams] = useState(null);
  
// //   // 🆕 מצב סינון מוכר
// //   const [vendorFilterMode, setVendorFilterMode] = useState(false);
// //   const [currentVendorInfo, setCurrentVendorInfo] = useState(null);
  
// //   // הגדרות
// //   const navigate = useNavigate();
// //   const location = useLocation();
  
// //   // refs
// //   const page = useRef(1);
// //   const limit = 12;
// //   const categoryId = useRef(initialCategory);
// //   const isInitialized = useRef(false);
// //   const currentVendorId = useRef(null);
// //   const allProductsRef = useRef([]);
// //   const searchContextRef = useRef(null);
  
// //   const { user } = useAuth();

// //   // עדכון הרפרנס כשהמוצרים משתנים
// //   useEffect(() => {
// //     allProductsRef.current = allProducts;
// //   }, [allProducts]);

// //   // 🔧 DEBUG זמני - הוסף כדי לראות מה קורה
// //   useEffect(() => {
// //     if (process.env.NODE_ENV === 'development') {
// //       console.log('🔍 ProductViewerContext Debug:', {
// //         pathname: location.pathname,
// //         allProductsLength: allProducts.length,
// //         selectedProductId: selectedProduct?._id,
// //         isModalOpen,
// //         vendorFilterMode,
// //         searchMode
// //       });
// //     }
// //   }, [location.pathname, allProducts.length, selectedProduct?._id, isModalOpen, vendorFilterMode, searchMode]);

// //   // פונקציה לאיפוס מלא של ה-State
// //   const resetProductState = useCallback(() => {
// //     console.log('🧹 מאפס את כל ה-State');
    
// //     setAllProducts([]);
// //     setLoading(false);
// //     setLoadingMore(false);
// //     setHasMore(true);
// //     setError(null);
// //     setSelectedProduct(null);
// //     setIsModalOpen(false);
    
// //     page.current = 1;
// //     allProductsRef.current = [];
    
// //     setSearchMode(false);
// //     setLastSearchParams(null);
    
// //     // 🆕 איפוס מצב מוכר
// //     setVendorFilterMode(false);
// //     setCurrentVendorInfo(null);
// //     currentVendorId.current = null;
// //   }, []);

// //   // פונקציה לטעינת מוצרים
// //   const loadProducts = useCallback(async (resetPage = false) => {
// //     if (resetPage) {
// //       page.current = 1;
// //     }
    
// //     setLoading(resetPage);
// //     if (!resetPage) {
// //       setLoadingMore(true);
// //     }
    
// //     try {
// //       const params = { 
// //         page: page.current, 
// //         limit
// //       };
      
// //       if (categoryId.current) {
// //         params.category = categoryId.current;
// //       }
      
// //       if (currentVendorId.current) {
// //         params.vendor = currentVendorId.current;
// //       }
      
// //       console.log('📤 טוען מוצרים עם פרמטרים:', params);
      
// //       const url = axios.defaults.baseURL ? '/full-products' : `${apiBaseUrl}/full-products`;
// //       const response = await axios.get(url, { params, withCredentials: true });
      
// //       if (response.data?.products) {
// //         console.log('📦 התקבלו מוצרים:', {
// //           count: response.data.products.length,
// //           pagination: response.data.pagination,
// //           page: page.current
// //         });
        
// //         const newProducts = response.data.products;
        
// //         // טעינה מקדימה של תמונות
// //         newProducts.forEach(product => {
// //           if (product.displayImage) {
// //             const img = new Image();
// //             img.src = product.displayImage;
// //           }
// //         });
        
// //         if (resetPage) {
// //           setAllProducts(newProducts);
// //         } else {
// //           setAllProducts(prev => [...prev, ...newProducts]);
// //         }
        
// //         // עדכון hasMore
// //         const pagination = response.data.pagination || {};
// //         console.log('📊 Pagination מהשרת:', pagination);
        
// //         if (pagination.hasMore !== undefined) {
// //           setHasMore(pagination.hasMore);
// //           console.log('✅ השתמש ב-hasMore מהשרת:', pagination.hasMore);
// //         } else {
// //           const calculatedHasMore = pagination.currentPage < pagination.totalPages;
// //           setHasMore(calculatedHasMore);
// //           console.log('🧮 חישב hasMore ידנית:', calculatedHasMore);
// //         }
        
// //         isInitialized.current = true;
// //         setSearchMode(false);
// //         setLastSearchParams(null);
        
// //         return newProducts;
// //       }
      
// //       throw new Error('תבנית תגובה לא תקינה מה-API');
// //     } catch (error) {
// //       console.error('❌ שגיאה בטעינת מוצרים:', error);
// //       setError('שגיאה בטעינת המוצרים');
// //       return [];
// //     } finally {
// //       setLoading(false);
// //       setLoadingMore(false);
// //     }
// //   }, [apiBaseUrl]);

// //   // טעינה ראשונית - רק אם אין vendorId בנתיב
// //   useEffect(() => {
// //     const initializeProducts = async () => {
// //       // 🔧 בדיקה אם יש vendorId בנתיב - אם כן, לא מתחיל אתחול רגיל
// //       const isVendorPath = location.pathname.includes('/vendor/');
      
// //       if (isVendorPath) {
// //         console.log('⏸️ מדלג על אתחול רגיל - זוהה נתיב מוכר');
// //         return;
// //       }
      
// //       console.log('🚀 אתחול מוצרים - טעינה ראשונית');
      
// //       if (!isInitialized.current) {
// //         setLoading(true);
        
// //         try {
// //           const params = { 
// //             page: 1, 
// //             limit
// //           };
          
// //           if (categoryId.current) {
// //             params.category = categoryId.current;
// //           }
          
// //           console.log('📤 טעינה ראשונית עם פרמטרים:', params);
          
// //           const url = axios.defaults.baseURL ? '/full-products' : `${apiBaseUrl}/full-products`;
// //           const response = await axios.get(url, { params, withCredentials: true });
          
// //           if (response.data?.products) {
// //             const newProducts = response.data.products;
            
// //             // טעינה מקדימה של תמונות
// //             newProducts.forEach(product => {
// //               if (product.displayImage) {
// //                 const img = new Image();
// //                 img.src = product.displayImage;
// //               }
// //             });
            
// //             setAllProducts(newProducts);
            
// //             // עדכון hasMore
// //             const pagination = response.data.pagination || {};
// //             if (pagination.hasMore !== undefined) {
// //               setHasMore(pagination.hasMore);
// //             } else {
// //               setHasMore(pagination.currentPage < pagination.totalPages);
// //             }
            
// //             isInitialized.current = true;
// //             page.current = 1;
            
// //             console.log('✅ אתחול הושלם בהצלחה');
// //           }
// //         } catch (error) {
// //           console.error('❌ שגיאה באתחול:', error);
// //           setError('שגיאה בטעינת המוצרים');
// //         } finally {
// //           setLoading(false);
// //         }
// //       }
// //     };
    
// //     initializeProducts();
// //   }, [apiBaseUrl, location.pathname]);

// //   // פונקציה לטעינת רשימת המועדפים
// //   const loadFavoriteIds = useCallback(async () => {
// //     if (!user) {
// //       setFavoriteIds(new Set());
// //       return;
// //     }
    
// //     try {
// //       const { favorites } = await favoritesService.getFavorites();
// //       const ids = new Set(favorites.map(fav => fav.product?._id).filter(Boolean));
// //       setFavoriteIds(ids);
// //     } catch (error) {
// //       console.error('Error loading favorite IDs:', error);
// //     }
// //   }, [user]);

// //   useEffect(() => {
// //     loadFavoriteIds();
// //   }, [loadFavoriteIds]);

// //   // פונקציה לטעינת מוצר ספציפי לפי ID
// //   const loadSpecificProduct = useCallback(async (productId) => {
// //     try {
// //       const url = axios.defaults.baseURL ? `/full-products/${productId}` : `${apiBaseUrl}/full-products/${productId}`;
// //       const response = await axios.get(url, { withCredentials: true });
      
// //       if (response.data?.product) {
// //         const product = response.data.product;
        
// //         if (product.displayImage) {
// //           const img = new Image();
// //           img.src = product.displayImage;
// //         }
        
// //         return product;
// //       }
      
// //       if (response.data && !response.data.product) {
// //         return response.data;
// //       }
      
// //       throw new Error('מוצר לא נמצא');
// //     } catch (error) {
// //       console.error('שגיאה בטעינת מוצר ספציפי:', error);
// //       setError('שגיאה בטעינת המוצר המבוקש');
// //       return null;
// //     }
// //   }, [apiBaseUrl]);

// //   // פונקציה לטיפול בתוצאות חיפוש
// //   const handleSearchResults = useCallback((searchResults, searchParams = null) => {
// //     console.log('🔍 מטפל בתוצאות חיפוש:', searchResults?.length, 'מוצרים');
    
// //     if (!searchResults || searchResults.length === 0) {
// //       console.log('❌ אין תוצאות חיפוש');
// //       resetProductState();
// //       setSearchMode(true);
// //       setLastSearchParams(searchParams);
// //       setHasMore(false);
// //       return;
// //     }
    
// //     console.log('📝 מגדיר תוצאות חיפוש:', searchResults.length, 'מוצרים');
    
// //     // 🔧 איפוס זהיר - לא מאפס loading state
// //     setAllProducts(searchResults);
// //     setSearchMode(true);
// //     setLastSearchParams(searchParams);
// //     setHasMore(false);
// //     setError(null);
    
// //     // 🆕 בדיקה אם מדובר בסינון מוכר
// //     if (searchParams?.vendors?.length === 1) {
// //       console.log('👤 מזהה סינון מוכר:', searchParams.vendors[0]);
// //       setVendorFilterMode(true);
// //       currentVendorId.current = searchParams.vendors[0];
      
// //       // קבלת מידע על המוכר מהמוצר הראשון
// //       if (searchResults[0]?.vendorId) {
// //         setCurrentVendorInfo(searchResults[0].vendorId);
// //         console.log('👤 מידע מוכר עודכן:', searchResults[0].vendorId.fullName);
// //       }
// //     } else {
// //       // איפוס מצב מוכר אם זה לא סינון מוכר
// //       setVendorFilterMode(false);
// //       setCurrentVendorInfo(null);
// //       currentVendorId.current = null;
// //     }
    
// //     // טעינה מקדימה של תמונות
// //     searchResults.forEach(product => {
// //       if (product.displayImage) {
// //         const img = new Image();
// //         img.src = product.displayImage;
// //       }
// //     });
    
// //     console.log('✅ תוצאות החיפוש הוגדרו בהצלחה');
// //   }, [resetProductState]);

// //   // פונקציה לניקוי חיפוש וחזרה למצב רגיל
// //   const clearSearchAndLoadNormal = useCallback(async () => {
// //     console.log('🧹 מנקה חיפוש וחוזר למצב רגיל');
    
// //     resetProductState();
// //     setSearchMode(false);
// //     setLastSearchParams(null);
// //     setVendorFilterMode(false);
// //     setCurrentVendorInfo(null);
// //     currentVendorId.current = null;
    
// //     await loadProducts(true);
// //   }, [resetProductState, loadProducts]);

// //   // פונקציה לטעינת עוד מוצרים
// //   const loadMoreProducts = useCallback(async () => {
// //     console.log('🔄 בודק אפשרות טעינת עוד מוצרים:', {
// //       hasMore,
// //       loadingMore,
// //       searchMode,
// //       vendorFilterMode,
// //       allProductsLength: allProducts.length
// //     });
    
// //     if (!hasMore || loadingMore) {
// //       console.log('❌ לא ניתן לטעון עוד:', { hasMore, loadingMore });
// //       return;
// //     }
    
// //     if (searchMode || vendorFilterMode) {
// //       console.log('❌ במצב חיפוש או סינון מוכר - לא ניתן לטעון עוד מוצרים');
// //       return;
// //     }
    
// //     try {
// //       console.log('⏳ טוען מוצרים נוספים...');
// //       page.current++;
// //       await loadProducts(false);
// //     } catch (error) {
// //       console.error('❌ שגיאה בטעינת מוצרים נוספים:', error);
// //       page.current--;
// //     }
// //   }, [hasMore, loadingMore, searchMode, vendorFilterMode, loadProducts, allProducts.length]);

// //   // פונקציה לרישום SearchContext
// //   const registerSearchContext = useCallback((searchContext) => {
// //     console.log('🔗 רושם SearchContext ב-ProductViewer');
// //     searchContextRef.current = searchContext;
    
// //     if (searchContext && searchContext.registerCallbacks) {
// //       searchContext.registerCallbacks({
// //         handleSearchResults,
// //         clearSearchAndLoadNormal,
// //         setCategory: (newCategoryId) => {
// //           if (categoryId.current === newCategoryId) return;
          
// //           console.log('📂 משנה קטגוריה:', newCategoryId);
          
// //           categoryId.current = newCategoryId;
// //           page.current = 1;
          
// //           setSearchMode(false);
// //           setLastSearchParams(null);
// //           setVendorFilterMode(false);
// //           setCurrentVendorInfo(null);
// //           currentVendorId.current = null;
          
// //           loadProducts(true);
// //         }
// //       });
// //     }
// //   }, [handleSearchResults, clearSearchAndLoadNormal, loadProducts]);

// //   // 🔧 פונקציות מודל מוצר - מתוקנות
// //   const openProductModal = useCallback((product) => {
// //     console.log('🚀 openProductModal called:', {
// //       productId: product._id,
// //       currentPath: location.pathname
// //     });
    
// //     setSelectedProduct(product);
// //     setIsModalOpen(true);
    
// //     // 🔧 תיקון: בדיקה ישירה של ה-URL הנוכחי
// //     const currentPath = location.pathname;
// //     const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
    
// //     let targetUrl;
// //     if (vendorMatch) {
// //       const vendorId = vendorMatch[1];
// //       targetUrl = `/vendor/${vendorId}/${product._id}`;
// //       console.log('📍 ניווט למוכר:', targetUrl);
// //     } else {
// //       targetUrl = `/product/${product._id}`;
// //       console.log('📍 ניווט רגיל:', targetUrl);
// //     }
    
// //     navigate(targetUrl, { 
// //       state: { backgroundLocation: location } 
// //     });
    
// //     analyticsService.trackModalOpen(product._id);
// //   }, [navigate, location]);

// //   const closeProductModal = useCallback(() => {
// //     console.log('🔚 closeProductModal called:', {
// //       currentPath: location.pathname,
// //       hasBackgroundLocation: !!location.state?.backgroundLocation
// //     });
    
// //     setIsModalOpen(false);
// //     setSelectedProduct(null);
    
// //     if (location.state?.backgroundLocation) {
// //       console.log('⬅️ חזרה למיקום קודם:', location.state.backgroundLocation.pathname);
// //       navigate(location.state.backgroundLocation);
// //     } else {
// //       const currentPath = location.pathname;
// //       const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
      
// //       let targetUrl;
// //       if (vendorMatch) {
// //         const vendorId = vendorMatch[1];
// //         targetUrl = `/vendor/${vendorId}`;
// //         console.log('⬅️ חזרה למוכר:', targetUrl);
// //       } else {
// //         targetUrl = '/products';
// //         console.log('⬅️ חזרה למוצרים:', targetUrl);
// //       }
      
// //       navigate(targetUrl);
// //     }
// //   }, [navigate, location]);

// //   const navigateToSpecificProduct = useCallback(async (productId, forceReload = false) => {
// //     console.log('🎯 navigateToSpecificProduct called:', {
// //       productId,
// //       forceReload,
// //       currentSelected: selectedProduct?._id,
// //       isModalOpen,
// //       currentPath: location.pathname
// //     });
    
// //     if (selectedProduct?._id === productId && isModalOpen && !forceReload) {
// //       console.log('✅ המוצר כבר פתוח - מדלג');
// //       return true;
// //     }
    
// //     const existingProduct = allProductsRef.current.find(p => p._id === productId);
    
// //     if (existingProduct && !forceReload) {
// //       console.log('✅ מוצר קיים - פותח ישירות');
// //       setSelectedProduct(existingProduct);
// //       setIsModalOpen(true);
      
// //       if (!isModalOpen && !location.pathname.includes(`/${productId}`)) {
// //         const navigateOptions = { state: { backgroundLocation: location } };
        
// //         // 🔧 תיקון: בדיקה ישירה של הנתיב
// //         const currentPath = location.pathname;
// //         const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
        
// //         let targetUrl;
// //         if (vendorMatch) {
// //           const vendorId = vendorMatch[1];
// //           targetUrl = `/vendor/${vendorId}/${productId}`;
// //           console.log('📍 ניווט מוצר קיים למוכר:', targetUrl);
// //         } else {
// //           targetUrl = `/product/${productId}`;
// //           console.log('📍 ניווט מוצר קיים רגיל:', targetUrl);
// //         }
        
// //         navigate(targetUrl, navigateOptions);
// //       }
      
// //       analyticsService.trackModalOpen(productId);
// //       return true;
// //     } else {
// //       try {
// //         console.log('⏳ טוען מוצר חדש...');
// //         const product = await loadSpecificProduct(productId);
// //         if (product) {
// //           console.log('✅ מוצר נטען בהצלחה', product._id);
// //           setSelectedProduct(product);
// //           setIsModalOpen(true);
          
// //           if (!isModalOpen && !location.pathname.includes(`/${productId}`)) {
// //             const navigateOptions = { state: { backgroundLocation: location } };
            
// //             // 🔧 תיקון: בדיקה ישירה של הנתיב
// //             const currentPath = location.pathname;
// //             const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
            
// //             let targetUrl;
// //             if (vendorMatch) {
// //               const vendorId = vendorMatch[1];
// //               targetUrl = `/vendor/${vendorId}/${productId}`;
// //               console.log('📍 ניווט מוצר חדש למוכר:', targetUrl);
// //             } else {
// //               targetUrl = `/product/${productId}`;
// //               console.log('📍 ניווט מוצר חדש רגיל:', targetUrl);
// //             }
            
// //             navigate(targetUrl, navigateOptions);
// //           }
          
// //           analyticsService.trackModalOpen(productId);
          
// //           setAllProducts(prev => {
// //             const exists = prev.find(p => p._id === product._id);
// //             if (exists) return prev;
// //             return [product, ...prev];
// //           });
          
// //           return true;
// //         }
// //         return false;
// //       } catch (error) {
// //         console.error('❌ Failed to navigate to product:', error);
// //         setError('שגיאה בטעינת המוצר');
// //         return false;
// //       }
// //     }
// //   }, [loadSpecificProduct, navigate, location, isModalOpen, selectedProduct]);

// //   // שאר הפונקציות
// //   const handleAffiliateClick = useCallback((productId) => {
// //     analyticsService.trackClick(productId);
// //   }, []);

// //   const isProductFavorite = useCallback((productId) => {
// //     return favoriteIds.has(productId);
// //   }, [favoriteIds]);

// //   const toggleFavorite = useCallback(async (productId) => {
// //     if (!user) {
// //       navigate('/login');
// //       return { success: false, message: 'יש להתחבר כדי להוסיף מוצרים למועדפים' };
// //     }

// //     try {
// //       if (isProductFavorite(productId)) {
// //         const result = await favoritesService.removeFavorite(productId);
// //         if (result.success) {
// //           setFavoriteIds(prev => {
// //             const newSet = new Set(prev);
// //             newSet.delete(productId);
// //             return newSet;
// //           });
// //         }
// //         return result;
// //       } else {
// //         const result = await favoritesService.addFavorite(productId);
// //         if (result.success) {
// //           setFavoriteIds(prev => {
// //             const newSet = new Set(prev);
// //             newSet.add(productId);
// //             return newSet;
// //           });
// //         }
// //         return result;
// //       }
// //     } catch (error) {
// //       console.error('Error toggling favorite:', error);
// //       return { success: false, message: error.message || 'שגיאה בעדכון מועדפים' };
// //     }
// //   }, [user, navigate, isProductFavorite]);

// //   const setSearchResults = useCallback((searchProducts) => {
// //     console.log('🔍 מעדכן תוצאות חיפוש:', searchProducts?.length, 'מוצרים');
// //     handleSearchResults(searchProducts);
// //   }, [handleSearchResults]);

// //   // Enhanced loadVendorProducts with comprehensive debugging
// //   const loadVendorProducts = useCallback(async (vendorId) => {
// //     console.log('🏪 טוען מוצרי מוכר עם מידע מלא:', vendorId);
    
// //     // 🔧 איפוס מלא לפני טעינת מוכר
// //     resetProductState();
// //     setLoading(true);
    
// //     try {
// //       currentVendorId.current = vendorId;
      
// //       // 📊 טעינת מוצרי מוכר
// //       const productsResponse = await axios.get(
// //         axios.defaults.baseURL ? '/full-products' : `${apiBaseUrl}/full-products`,
// //         {
// //           params: {
// //             vendor: vendorId,
// //             limit: 20,
// //             page: 1
// //           },
// //           withCredentials: true
// //         }
// //       );
      
// //       console.log('📤 בקשת מוצרי מוכר עם פרמטרים:', {
// //         vendor: vendorId,
// //         limit: 20,
// //         page: 1
// //       });
      
// //       if (productsResponse.data?.products) {
// //         const vendorProducts = productsResponse.data.products;
        
// //         console.log('📦 התקבלו מוצרי מוכר:', vendorProducts.length);
        
// //         // 🔍 DEBUG: בדיקת המידע שמגיע מהשרת
// //         if (vendorProducts.length > 0) {
// //           const firstProduct = vendorProducts[0];
// //           console.log('🔍 DEBUG: מוצר ראשון:', {
// //             id: firstProduct._id,
// //             title: firstProduct.title,
// //             vendorId: firstProduct.vendorId
// //           });
          
// //           if (firstProduct.vendorId) {
// //             console.log('🔍 DEBUG: מידע מוכר מהמוצר הראשון:', {
// //               _id: firstProduct.vendorId._id,
// //               fullName: firstProduct.vendorId.fullName,
// //               email: firstProduct.vendorId.email,
// //               profileImage: firstProduct.vendorId.profileImage,
// //               bio: firstProduct.vendorId.bio,
// //               social: firstProduct.vendorId.social,
// //               allFields: Object.keys(firstProduct.vendorId)
// //             });
// //           }
// //         }
        
// //         // 🆕 בניית אובייקט מידע מוכר מלא
// //         let vendorInfo = null;
        
// //         if (vendorProducts.length > 0 && vendorProducts[0].vendorId) {
// //           const basicVendorData = vendorProducts[0].vendorId;
          
// //           // 🔍 DEBUG: חישוב דירוג
// //           const ratings = vendorProducts
// //             .map(p => p.aliExpressData?.rating || p.rating)
// //             .filter(r => r && r > 0);
          
// //           console.log('🔍 DEBUG: דירוגים:', {
// //             totalProducts: vendorProducts.length,
// //             ratingsFound: ratings.length,
// //             ratings: ratings
// //           });
          
// //           const avgRating = ratings.length > 0 
// //             ? Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10
// //             : null;
          
// //           vendorInfo = {
// //             _id: basicVendorData._id,
// //             fullName: basicVendorData.fullName,
// //             email: basicVendorData.email,
// //             profileImage: basicVendorData.profileImage,
// //             bio: basicVendorData.bio || ' מציע המלצות איכותיות למוצרים מובחרים',
// //             productCount: vendorProducts.length,
// //             avgRating: avgRating,
// //             social: basicVendorData.social || {},
// //             createdAt: basicVendorData.createdAt
// //           };
          
// //           console.log('👤 DEBUG: מידע מוכר מלא שנבנה:', {
// //             name: vendorInfo.fullName,
// //             bio: vendorInfo.bio,
// //             productCount: vendorInfo.productCount,
// //             avgRating: vendorInfo.avgRating,
// //             hasProfileImage: !!vendorInfo.profileImage
// //           });
// //         }
        
// //         if (vendorInfo) {
// //           setCurrentVendorInfo(vendorInfo);
// //           console.log('✅ מידע מוכר נשמר בקונטקסט');
// //         } else {
// //           console.log('❌ לא ניתן לבנות מידע מוכר');
// //         }
        
// //         // הגדרת מצב סינון מוכר
// //         setVendorFilterMode(true);
        
// //         // עדכון התוצאות ישירות
// //         setAllProducts(vendorProducts);
// //         setSearchMode(true);
// //         setLastSearchParams({ vendors: [vendorId] });
// //         setHasMore(false); // מוצרי מוכר לא נטענים בחלקים
        
// //         console.log('✅ מוצרי מוכר הוגדרו בהצלחה');
        
// //         return vendorProducts;
// //       }
      
// //       throw new Error('לא נמצאו מוצרים למוכר זה');
// //     } catch (error) {
// //       console.error('❌ Error loading vendor products:', error);
// //       setError('שגיאה בטעינת מוצרי המוכר');
// //       return [];
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [apiBaseUrl, resetProductState]);

// //   // ערכי הקונטקסט
// //   const value = {
// //     // State
// //     products: allProducts,
// //     selectedProduct,
// //     isModalOpen,
// //     loading,
// //     loadingMore,
// //     hasMore,
// //     error,
// //     searchMode,
// //     lastSearchParams,
// //     vendorFilterMode,
// //     currentVendorInfo,
    
// //     // Debug info
// //     debugInfo: {
// //       page: page.current,
// //       totalProducts: allProducts.length,
// //       searchMode,
// //       vendorFilterMode,
// //       hasMore,
// //       loadingMore
// //     },
    
// //     // Actions
// //     openProductModal,
// //     closeProductModal,
// //     loadMoreProducts,
// //     handleAffiliateClick,
// //     isProductFavorite,  
// //     toggleFavorite,     
// //     loadFavoriteIds,
// //     handleSearchResults,
// //     clearSearchAndLoadNormal,
// //     resetProductState,
// //     navigateToSpecificProduct,
// //     setSearchResults,
// //     loadVendorProducts,
// //     registerSearchContext,
// //   };

// //   return (
// //     <ProductViewerContext.Provider value={value}>
// //       {children}
// //     </ProductViewerContext.Provider>
// //   );
// // };
// // src/contexts/ProductViewerContext.jsx - 🚀 תיקון מהיר ל-2x renders
// import React, { createContext, useContext, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useProducts, useProduct } from '../hooks/useProducts';
// import { useProductModal } from './ProductModalContext';
// import { useFavorites } from '../hooks/useFavorites';
// import { useAuth } from './AuthContext';

// const ProductViewerContext = createContext(null);

// export const useProductViewer = () => {
//   const context = useContext(ProductViewerContext);
//   if (!context) {
//     throw new Error('useProductViewer must be used within ProductViewerProvider');
//   }
//   return context;
// };

// /**
//  * 🎯 ProductViewerContext מתוקן - מונע 2x renders
//  * התיקון העיקרי: memoization של context value
//  */
// export const ProductViewerProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   // 🎯 שימוש ב-hooks קיימים
//   const productsData = useProducts();
//   const modal = useProductModal();
//   const favoritesData = useFavorites();
  
//   // 🎯 מוצר ספציפי - רק אם יש מוצר נבחר
//   const selectedProductQuery = useProduct(modal?.selectedProduct?._id);
  
//   // 🎯 פונקציות מועדפים - עם useCallback למניעת re-creation
//   const favoriteHandlers = useMemo(() => ({
//     isProductFavorite: (productId) => {
//       if (!productId) return false;
//       return favoritesData?.favoriteIds?.has?.(productId) || false;
//     },
    
//     toggleFavorite: async (productId) => {
//       if (!user) {
//         navigate('/login');
//         return { success: false, message: 'יש להתחבר כדי להוסיף מוצרים למועדפים' };
//       }
      
//       if (!productId) {
//         return { success: false, message: 'מזהה מוצר חסר' };
//       }
      
//       if (favoritesData?.toggleFavorite) {
//         return await favoritesData.toggleFavorite(productId);
//       }
      
//       return { success: false, message: 'שירות מועדפים לא זמין' };
//     },
    
//     loadFavoriteIds: () => {
//       if (favoritesData?.loadFavorites && typeof favoritesData.loadFavorites === 'function') {
//         favoritesData.loadFavorites();
//       }
//     }
//   }), [favoritesData?.favoriteIds, favoritesData?.toggleFavorite, favoritesData?.loadFavorites, user, navigate]);
  
//   // 🎯 פונקציות מודל - עם useCallback
//   const modalHandlers = useMemo(() => ({
//     openProductModal: (product) => {
//       if (modal?.openProductModal && typeof modal.openProductModal === 'function') {
//         modal.openProductModal(product);
//       }
//     },
    
//     closeProductModal: () => {
//       if (modal?.closeProductModal && typeof modal.closeProductModal === 'function') {
//         modal.closeProductModal();
//       }
//     },
    
//     navigateToSpecificProduct: (productId) => {
//       if (modal?.navigateToProduct && typeof modal.navigateToProduct === 'function') {
//         return modal.navigateToProduct(productId);
//       }
//       return Promise.resolve(false);
//     },
    
//     handleAffiliateClick: (productId) => {
//       if (modal?.handleAffiliateClick && typeof modal.handleAffiliateClick === 'function') {
//         modal.handleAffiliateClick(productId);
//       }
//     }
//   }), [modal?.openProductModal, modal?.closeProductModal, modal?.navigateToProduct, modal?.handleAffiliateClick]);
  
//   // 🎯 פונקציות טעינה - עם useCallback
//   const loadingHandlers = useMemo(() => ({
//     loadMoreProducts: () => {
//       if (productsData?.loadMore && typeof productsData.loadMore === 'function') {
//         productsData.loadMore();
//       }
//     },
    
//     refetch: () => {
//       if (productsData?.refetch && typeof productsData.refetch === 'function') {
//         productsData.refetch();
//       }
//     }
//   }), [productsData?.loadMore, productsData?.refetch]);
  
//   // 🚀 **הקסם כאן** - Context value עם memoization מלא
//   const contextValue = useMemo(() => ({
//     // נתונים - יציבים
//     products: Array.isArray(productsData?.products) ? productsData.products : [],
//     allProducts: Array.isArray(productsData?.products) ? productsData.products : [], // Backward compatibility
//     loading: Boolean(productsData?.isLoading),
//     loadingMore: Boolean(productsData?.isFetchingNextPage),
//     hasMore: Boolean(productsData?.hasMore),
//     error: productsData?.error?.message || null,
//     searchMode: Boolean(productsData?.isSearchMode),
//     isSearchMode: Boolean(productsData?.isSearchMode), // Alias
//     totalProducts: typeof productsData?.totalProducts === 'number' ? productsData.totalProducts : 0,
//     queryType: productsData?.queryType || 'all',
    
//     // מודל - יציב
//     selectedProduct: selectedProductQuery?.data || modal?.selectedProduct || null,
//     isModalOpen: Boolean(modal?.isModalOpen),
    
//     // פונקציות - יציבות עם memoization
//     ...loadingHandlers,
//     ...modalHandlers,
//     ...favoriteHandlers,
    
//     // Backward compatibility - פונקציות deprecated
//     handleSearchResults: () => Promise.resolve(),
//     clearSearchAndLoadNormal: loadingHandlers.refetch,
//     setSearchResults: () => {},
//     loadVendorProducts: () => Promise.resolve([]),
//     resetProductState: () => {},
//     registerSearchContext: () => {},
    
//     // נתונים נוספים
//     vendorFilterMode: (productsData?.queryType || 'all') === 'vendor',
//     currentVendorInfo: null
//   }), [
//     // 🎯 **רק dependencies שבאמת משתנים**
//     productsData?.products,
//     productsData?.isLoading,
//     productsData?.isFetchingNextPage,
//     productsData?.hasMore,
//     productsData?.error,
//     productsData?.isSearchMode,
//     productsData?.totalProducts,
//     productsData?.queryType,
//     selectedProductQuery?.data,
//     modal?.selectedProduct,
//     modal?.isModalOpen,
//     loadingHandlers,
//     modalHandlers,
//     favoriteHandlers
//   ]);
  
//   return (
//     <ProductViewerContext.Provider value={contextValue}>
//       {children}
//     </ProductViewerContext.Provider>
//   );
// };
// src/contexts/ProductViewerContext.jsx - 🔧 הסרת ניהול מודל כפול
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useProduct } from '../hooks/useProducts';
import { useProductModal } from './ProductModalContext';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from './AuthContext';

const ProductViewerContext = createContext(null);

export const useProductViewer = () => {
  const context = useContext(ProductViewerContext);
  if (!context) {
    throw new Error('useProductViewer must be used within ProductViewerProvider');
  }
  return context;
};

export const ProductViewerProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const productsData = useProducts();
  const modal = useProductModal();
  const favoritesData = useFavorites();
  
  const selectedProductQuery = useProduct(modal?.selectedProduct?._id);
  
  // 🎯 פונקציות מועדפים - יציבות מלאה
  const favoriteHandlers = useMemo(() => ({
    isProductFavorite: (productId) => {
      if (!productId) return false;
      return favoritesData?.favoriteIds?.has?.(productId) || false;
    },
    
    toggleFavorite: async (productId) => {
      if (!user) {
        navigate('/login');
        return { success: false, message: 'יש להתחבר כדי להוסיף מוצרים למועדפים' };
      }
      
      if (!productId) {
        return { success: false, message: 'מזהה מוצר חסר' };
      }
      
      if (favoritesData?.toggleFavorite) {
        return await favoritesData.toggleFavorite(productId);
      }
      
      return { success: false, message: 'שירות מועדפים לא זמין' };
    },
    
    loadFavoriteIds: () => {
      if (favoritesData?.loadFavorites && typeof favoritesData.loadFavorites === 'function') {
        favoritesData.loadFavorites();
      }
    }
  }), [favoritesData?.favoriteIds, favoritesData?.toggleFavorite, favoritesData?.loadFavorites, user, navigate]);
  
  // 🔧 **תיקון מרכזי: פונקציות מודל ללא עיכובים**
  const modalHandlers = useMemo(() => ({
    // 🚀 פתיחת מודל - ישירה לגמרי
    openProductModal: modal?.openProductModal || (() => {}),
    
    // 🚀 סגירת מודל - ישירה לגמרי, ללא שכבות נוספות
    closeProductModal: modal?.closeProductModal || (() => {}),
    
    // 🚀 ניווט למוצר - ישיר
    navigateToSpecificProduct: modal?.navigateToProduct || (() => Promise.resolve(false)),
    
    // 🚀 קליק affiliate - ישיר  
    handleAffiliateClick: modal?.handleAffiliateClick || (() => {})
  }), [
    modal?.openProductModal, 
    modal?.closeProductModal, 
    modal?.navigateToProduct, 
    modal?.handleAffiliateClick
  ]);
  
  // 🎯 פונקציות טעינה
  const loadingHandlers = useMemo(() => ({
    loadMoreProducts: () => {
      if (productsData?.loadMore && typeof productsData.loadMore === 'function') {
        productsData.loadMore();
      }
    },
    
    refetch: () => {
      if (productsData?.refetch && typeof productsData.refetch === 'function') {
        productsData.refetch();
      }
    }
  }), [productsData?.loadMore, productsData?.refetch]);
  
  // 🚀 **Context value עם dependency optimization מלא**
  const contextValue = useMemo(() => ({
    // נתונים יציבים
    products: Array.isArray(productsData?.products) ? productsData.products : [],
    allProducts: Array.isArray(productsData?.products) ? productsData.products : [],
    loading: Boolean(productsData?.isLoading),
    loadingMore: Boolean(productsData?.isFetchingNextPage),
    hasMore: Boolean(productsData?.hasMore),
    error: productsData?.error?.message || null,
    searchMode: Boolean(productsData?.isSearchMode),
    isSearchMode: Boolean(productsData?.isSearchMode),
    totalProducts: typeof productsData?.totalProducts === 'number' ? productsData.totalProducts : 0,
    queryType: productsData?.queryType || 'all',
    
    // מודל - ישיר מה-modal context
    selectedProduct: selectedProductQuery?.data || modal?.selectedProduct || null,
    isModalOpen: Boolean(modal?.isModalOpen),
    
    // פונקציות יציבות
    ...loadingHandlers,
    ...favoriteHandlers,
    
    // 🔧 **פונקציות מודל ישירות - ללא wrappers מיותרים**
    openProductModal: modalHandlers.openProductModal,
    closeProductModal: modalHandlers.closeProductModal,
    navigateToSpecificProduct: modalHandlers.navigateToSpecificProduct,
    handleAffiliateClick: modalHandlers.handleAffiliateClick,
    
    // Backward compatibility - deprecated functions
    handleSearchResults: () => Promise.resolve(),
    clearSearchAndLoadNormal: loadingHandlers.refetch,
    setSearchResults: () => {},
    loadVendorProducts: () => Promise.resolve([]),
    resetProductState: () => {},
    registerSearchContext: () => {},
    
    // מידע נוסף
    vendorFilterMode: (productsData?.queryType || 'all') === 'vendor',
    currentVendorInfo: null
  }), [
    // 🎯 רק dependencies שבאמת משתנים
    productsData?.products,
    productsData?.isLoading,
    productsData?.isFetchingNextPage, 
    productsData?.hasMore,
    productsData?.error?.message,
    productsData?.isSearchMode,
    productsData?.totalProducts,
    productsData?.queryType,
    selectedProductQuery?.data,
    modal?.selectedProduct,
    modal?.isModalOpen,
    loadingHandlers,
    favoriteHandlers,
    modalHandlers
  ]);
  
  return (
    <ProductViewerContext.Provider value={contextValue}>
      {children}
    </ProductViewerContext.Provider>
  );
};