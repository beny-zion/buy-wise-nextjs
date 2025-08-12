// // src/components/common/ProductsManager.jsx
// import React, { useEffect } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useProducts, useProduct, useVendor } from '../../hooks/useProducts';
// import { useProductModal } from '../../contexts/ProductModalContext';
// import { useSearch } from '../../contexts/SearchContext';

// /**
//  * קומפוננטה חכמה שמנהלת את כל זרימת הנתונים
//  * מחברת בין הנתיב, החיפוש והנתונים
//  */
// const ProductsManager = ({ children }) => {
//   const { id, vendorId } = useParams();
//   const location = useLocation();
//   const { products, isLoading, hasMore, loadMore, isSearchMode } = useProducts();
//   const { navigateToProduct, isModalOpen } = useProductModal();
//   const { selectVendor, filterOptions } = useSearch();
  
//   // 🎯 טעינת מוצר ספציפי אם יש בURL
//   const { data: specificProduct } = useProduct(id);
  
//   // 🎯 טעינת מידע מוכר אם יש בURL
//   const { data: vendorInfo } = useVendor(vendorId);
  
//   // 🔄 טיפול בשינויי URL - פשוט ונקי!
//   useEffect(() => {
//     // אם המודל פתוח, לא לעשות כלום
//     if (isModalOpen) return;
    
//     // אם יש מוצר בURL - פתח מודל
//     if (id && location.pathname.includes('/product/')) {
//       navigateToProduct(id);
//     }
    
//     // אם יש מוכר בURL - בחר אותו
//     if (vendorId && location.pathname.includes('/vendor/')) {
//       const vendor = filterOptions.vendors.find(v => v._id === vendorId);
//       if (vendor) {
//         selectVendor(vendor);
//       } else if (vendorInfo) {
//         // אם המוכר לא ברשימה אבל יש לנו מידע עליו
//         selectVendor(vendorInfo);
//       }
      
//       // אם יש גם מוצר ספציפי של המוכר
//       if (id) {
//         setTimeout(() => navigateToProduct(id), 300);
//       }
//     }
//   }, [id, vendorId, location.pathname, isModalOpen, vendorInfo]);
  
//   // 🎯 העברת הנתונים לילדים
//   return children({
//     // נתוני מוצרים
//     products,
//     isLoading,
//     hasMore,
//     loadMore,
//     isSearchMode,
    
//     // מוצר ספציפי (אם נטען)
//     specificProduct,
    
//     // מידע מוכר (אם רלוונטי)
//     vendorInfo
//   });
// };

// export default ProductsManager;// src/components/common/ProductsManager.jsx - 🔧 תיקון לופ פתיחה/סגירה
import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProducts, useProduct, useVendor } from '../../hooks/useProducts';
import { useProductModal } from '../../contexts/ProductModalContext';
import { useSearch } from '../../contexts/SearchContext';

/**
 * 🔧 ProductsManager מתוקן - עוצר לופ פתיחה/סגירה של מודל
 */
const ProductsManager = ({ children }) => {
  const { id, vendorId } = useParams();
  const location = useLocation();
  const { navigateToProduct, isModalOpen } = useProductModal();
  const { selectVendor, filterOptions, selectedVendor } = useSearch();
  
  // 🛑 רפס למניעת לופים אינסופיים
  const lastProcessedVendor = useRef(null);
  const lastProcessedProduct = useRef(null);
  const processingVendor = useRef(false);
  const modalWasOpen = useRef(false); // 🔧 **תיקון מרכזי: זכירת מצב המודל**
  
  // 🎯 טעינת נתונים
  const productsHook = useProducts();
  const { data: specificProduct } = useProduct(id);
  const { data: vendorInfo } = useVendor(vendorId);
  
  // 🛡️ הגנות על הנתונים
  const products = Array.isArray(productsHook?.products) ? productsHook.products : [];
  const isLoading = Boolean(productsHook?.isLoading);
  const hasMore = Boolean(productsHook?.hasMore);
  const loadMore = typeof productsHook?.loadMore === 'function' ? productsHook.loadMore : () => {};
  const isSearchMode = Boolean(productsHook?.isSearchMode);
  const error = productsHook?.error?.message || null;
  
  // 🔧 **תיקון: מעקב אחר מצב המודל**
  useEffect(() => {
    modalWasOpen.current = isModalOpen;
  }, [isModalOpen]);
  
  // 🔍 Debug logging מקוצר
  console.log('ProductsManager:', {
    vendorId,
    productId: id,
    productsCount: products.length,
    isLoading,
    isModalOpen,
    selectedVendorId: selectedVendor?._id,
    lastProcessedProduct: lastProcessedProduct.current
  });
  
  // 🔄 טיפול בשינויי URL - עם מניעת לופים
  useEffect(() => {
    // 🛑 מניעת עיבוד מיותר
    if (processingVendor.current) return;
    
    // 🔧 **תיקון מרכזי: טיפול במוצר ספציפי עם בדיקת מצב המודל**
    if (id && location.pathname.includes('/product/')) {
      // 🛑 אל תפתח מוצר אם:
      // 1. המודל כבר פתוח עם אותו מוצר
      // 2. המוצר כבר עובד
      // 3. המודל נסגר זה עתה (מניעת פתיחה מחדש)
      if (isModalOpen && lastProcessedProduct.current === id) {
        console.log('✅ Product already open in modal, skipping...');
        return;
      }
      
      if (lastProcessedProduct.current === id && !isModalOpen && modalWasOpen.current) {
        console.log('🛑 Product was just closed, not reopening immediately');
        return;
      }
      
      if (lastProcessedProduct.current !== id) {
        console.log('🎯 Opening NEW product:', id);
        lastProcessedProduct.current = id;
        navigateToProduct(id);
        return;
      }
    }
    
    // טיפול במוכר - עם מניעת לופים
    if (vendorId && location.pathname.includes('/vendor/')) {
      // 🛑 בדיקה אם כבר עיבדנו את המוכר הזה
      if (lastProcessedVendor.current === vendorId) {
        console.log('🛑 Vendor already processed:', vendorId);
        return;
      }
      
      // בדיקה אם המוכר כבר נבחר
      if (selectedVendor?._id === vendorId) {
        console.log('✅ Vendor already selected:', vendorId);
        lastProcessedVendor.current = vendorId;
        return;
      }
      
      console.log('👤 Processing vendor:', vendorId);
      processingVendor.current = true;
      lastProcessedVendor.current = vendorId;
      
      // חפש מוכר ברשימה הקיימת
      const vendor = filterOptions?.vendors?.find(v => v._id === vendorId);
      
      if (vendor) {
        console.log('✅ Found vendor in list:', vendor.fullName);
        selectVendor(vendor);
      } else if (vendorInfo) {
        console.log('✅ Using loaded vendor info:', vendorInfo.fullName);
        selectVendor(vendorInfo);
      } else {
        console.log('⏳ Waiting for vendor info...');
      }
      
      // שחרר את הנעילה אחרי זמן קצר
      setTimeout(() => {
        processingVendor.current = false;
      }, 1000);
      
      // 🔧 **תיקון: טיפול במוצר ספציפי של המוכר עם עיכוב**
      if (id && lastProcessedProduct.current !== id) {
        console.log('🎯 Opening vendor product with delay:', id);
        lastProcessedProduct.current = id;
        // עיכוב קטן כדי לתת למוכר להיטען
        setTimeout(() => navigateToProduct(id), 800);
      }
    }
    
    // 🔧 **תיקון: איפוס כשיוצאים מהעמוד**
    if (!vendorId && !id) {
      if (lastProcessedVendor.current || lastProcessedProduct.current) {
        console.log('🧹 Clearing all processed items');
        lastProcessedVendor.current = null;
        lastProcessedProduct.current = null;
        modalWasOpen.current = false;
      }
    }
    
  }, [
    id, 
    vendorId, 
    location.pathname,
    isModalOpen,
    vendorInfo?._id,
    filterOptions?.vendors,
    selectedVendor?._id,
    selectVendor,
    navigateToProduct
  ]);
  
  // 🔧 **תיקון נוסף: איפוס מצב המודל כשהמסלול משתנה לגמרי**
  useEffect(() => {
    // אם עברנו לעמוד שונה לגמרי (לא מוצר או מוכר), נאפס הכל
    if (!location.pathname.includes('/product/') && 
        !location.pathname.includes('/vendor/')) {
      lastProcessedProduct.current = null;
      lastProcessedVendor.current = null;
      modalWasOpen.current = false;
    }
  }, [location.pathname]);
  
  // 🎯 העברת הנתונים לילדים
  const childProps = {
    products,
    isLoading,
    hasMore,
    loadMore,
    isSearchMode,
    error,
    specificProduct,
    vendorInfo,
    debug: {
      totalProducts: products.length,
      queryType: productsHook?.queryType,
      pathname: location.pathname,
      vendorId,
      productId: id,
      selectedVendorId: selectedVendor?._id,
      lastProcessedVendor: lastProcessedVendor.current,
      lastProcessedProduct: lastProcessedProduct.current,
      isModalOpen,
      modalWasOpen: modalWasOpen.current
    }
  };
  
  return children(childProps);
};

export default ProductsManager;