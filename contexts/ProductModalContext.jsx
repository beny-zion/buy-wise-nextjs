// // src/contexts/ProductModalContext.jsx
// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { analyticsService } from '../services/api/analytics';

// const ProductModalContext = createContext(null);

// export const useProductModal = () => {
//   const context = useContext(ProductModalContext);
//   if (!context) {
//     throw new Error('useProductModal must be used within ProductModalProvider');
//   }
//   return context;
// };

// /**
//  * קונטקסט פשוט לניהול מודלים וניווט בלבד
//  * לא מנהל נתונים - רק UI!
//  */
// export const ProductModalProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // 🎯 פתיחת מודל
//   const openProductModal = useCallback((product) => {
//     if (!product?._id) return;
    
//     console.log('🚀 Opening product modal:', product._id);
    
//     setSelectedProduct(product);
//     setIsModalOpen(true);
    
//     // עדכון URL
//     const currentPath = location.pathname;
//     const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
    
//     let targetUrl;
//     if (vendorMatch) {
//       targetUrl = `/vendor/${vendorMatch[1]}/${product._id}`;
//     } else {
//       targetUrl = `/product/${product._id}`;
//     }
    
//     navigate(targetUrl, { 
//       state: { backgroundLocation: location } 
//     });
    
//     // Analytics
//     analyticsService.trackModalOpen(product._id);
//   }, [navigate, location]);
  
//   // 🎯 סגירת מודל
//   const closeProductModal = useCallback(() => {
//     console.log('🔚 Closing product modal');
    
//     setIsModalOpen(false);
//     setSelectedProduct(null);
    
//     // חזרה למיקום הקודם
//     if (location.state?.backgroundLocation) {
//       navigate(location.state.backgroundLocation);
//     } else {
//       const currentPath = location.pathname;
//       const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
      
//       let targetUrl;
//       if (vendorMatch) {
//         targetUrl = `/vendor/${vendorMatch[1]}`;
//       } else {
//         targetUrl = '/products';
//       }
      
//       navigate(targetUrl);
//     }
//   }, [navigate, location]);
  
//   // 🎯 ניווט למוצר ספציפי (מURL)
//   const navigateToProduct = useCallback(async (productId) => {
//     if (!productId) return false;
    
//     // אם המודל כבר פתוח עם המוצר הזה
//     if (selectedProduct?._id === productId && isModalOpen) {
//       return true;
//     }
    
//     // נפתח מודל ריק - הנתונים יגיעו מ-useProduct
//     setSelectedProduct({ _id: productId });
//     setIsModalOpen(true);
    
//     return true;
//   }, [selectedProduct, isModalOpen]);
  
//   // 🎯 טיפול בלחיצת affiliate
//   const handleAffiliateClick = useCallback((productId) => {
//     analyticsService.trackClick(productId);
//   }, []);
  
//   const value = {
//     // State
//     selectedProduct,
//     isModalOpen,
    
//     // Actions
//     openProductModal,
//     closeProductModal,
//     navigateToProduct,
//     handleAffiliateClick
//   };
  
//   return (
//     <ProductModalContext.Provider value={value}>
//       {children}
//     </ProductModalContext.Provider>
//   );
// };
// src/contexts/ProductModalContext.jsx - 🔧 תיקון סגירת מודל
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { analyticsService } from '../services/api/analytics';

const ProductModalContext = createContext(null);

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within ProductModalProvider');
  }
  return context;
};

export const ProductModalProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🎯 פתיחת מודל
  const openProductModal = useCallback((product) => {
    if (!product?._id) return;
    
    console.log('🚀 Opening product modal:', product._id);
    
    setSelectedProduct(product);
    setIsModalOpen(true);
    
    // עדכון URL
    const currentPath = location.pathname;
    const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
    
    let targetUrl;
    if (vendorMatch) {
      targetUrl = `/vendor/${vendorMatch[1]}/${product._id}`;
    } else {
      targetUrl = `/product/${product._id}`;
    }
    
    navigate(targetUrl, { 
      state: { backgroundLocation: location } 
    });
    
    analyticsService.trackModalOpen(product._id);
  }, [navigate, location]);
  
  // 🔧 **תיקון עיקרי: סגירת מודל בעדכון אטומי יחיד**
  const closeProductModal = useCallback(() => {
    console.log('🔚 Closing product modal - SINGLE UPDATE');
    
    // 🚀 עדכון אטומי יחיד עם functional update
    setIsModalOpen(prevOpen => {
      if (!prevOpen) {
        console.log('⏸️ Modal already closed, skipping...');
        return false;
      }
      
      // 🎯 עדכון selectedProduct רק אם המודל באמת פתוח
      setSelectedProduct(null);
      
      // 🎯 ניווט מיידי אחרי שמירת ה-state
      setTimeout(() => {
        if (location.state?.backgroundLocation) {
          console.log('⬅️ Back to background location');
          navigate(location.state.backgroundLocation, { replace: true });
        } else {
          const currentPath = location.pathname;
          const vendorMatch = currentPath.match(/^\/vendor\/([^\/]+)/);
          
          let targetUrl;
          if (vendorMatch) {
            targetUrl = `/vendor/${vendorMatch[1]}`;
          } else {
            targetUrl = '/products';
          }
          
          console.log('⬅️ Navigate to:', targetUrl);
          navigate(targetUrl, { replace: true });
        }
      }, 0); // רק micro-task delay
      
      return false;
    });
  }, [navigate, location]);
  
  // 🎯 ניווט למוצר ספציפי
  const navigateToProduct = useCallback(async (productId) => {
    if (!productId) return false;
    
    if (selectedProduct?._id === productId && isModalOpen) {
      return true;
    }
    
    setSelectedProduct({ _id: productId });
    setIsModalOpen(true);
    
    return true;
  }, [selectedProduct, isModalOpen]);
  
  // 🎯 טיפול בלחיצת affiliate
  const handleAffiliateClick = useCallback((productId) => {
    analyticsService.trackClick(productId);
  }, []);
  
  // 🚀 **תיקון מרכזי: memoization מלא של הערך**
  const value = useMemo(() => ({
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal,
    navigateToProduct,
    handleAffiliateClick
  }), [
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal,
    navigateToProduct,
    handleAffiliateClick
  ]);
  
  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};