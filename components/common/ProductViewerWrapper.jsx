/* needed */
// components/common/ProductViewerWrapper.jsx - FINAL FIX (דגל סגירת מודל)
import React, { useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProductViewer } from '../../contexts/ProductViewerContext';
import { useSearch } from '../../contexts/SearchContext';

/**
 * 🔗 Wrapper שמחבר בין פרמטרי הנתיב לקונטקסט
 * מעביר את פרמטרי ה-URL לקונטקסט כשהם משתנים
 */
const ProductViewerWrapper = ({ children }) => {
  const params = useParams();
  const location = useLocation();
  const { 
    navigateToSpecificProduct, 
    loadVendorProducts, 
    selectedProduct,
    isModalOpen,
    vendorFilterMode,
    currentVendorInfo
  } = useProductViewer();
  
  const { selectVendor, filterOptions } = useSearch();
  
  // 🔄 רפרנסים למניעת loops
  const lastProcessedParams = useRef({ id: null, vendorId: null, pathname: null });
  const isProcessing = useRef(false);
  
  // 🆕 דגל חדש - מעקב אחרי סגירת מודל
  const wasModalOpen = useRef(false);
  const modalJustClosed = useRef(false);
  
  // 🆕 עדכון דגל המודל
  useEffect(() => {
    if (wasModalOpen.current && !isModalOpen) {
      // המודל היה פתוח ועכשיו סגור
      console.log('🚪 מודל נסגר - מגדיר דגל');
      modalJustClosed.current = true;
      
      // נקה את הדגל אחרי זמן קצר
      setTimeout(() => {
        modalJustClosed.current = false;
        console.log('🧹 דגל סגירת מודל נוקה');
      }, 100);
    }
    
    wasModalOpen.current = isModalOpen;
  }, [isModalOpen]);
  
  // 🔧 הוסף debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 ProductViewerWrapper Debug:', {
        pathname: location.pathname,
        params,
        isProcessing: isProcessing.current,
        lastProcessed: lastProcessedParams.current,
        selectedProduct: selectedProduct?._id,
        isModalOpen,
        wasModalOpen: wasModalOpen.current,
        modalJustClosed: modalJustClosed.current,
        vendorFilterMode,
        currentVendorId: currentVendorInfo?._id
      });
    }
  }, [location.pathname, params, selectedProduct?._id, isModalOpen, vendorFilterMode, currentVendorInfo?._id]);
  
  // 🔧 useEffect מופחת - רק עם שינויים אמיתיים
  useEffect(() => {
    const { id, vendorId } = params;
    const pathname = location.pathname;
    
    // 🔧 תיקון חשוב: אם המודל פתוח, לא לעשות כלום!
    if (isModalOpen) {
      console.log('⏸️ מודל פתוח - מדלג על עיבוד פרמטרים');
      return;
    }
    
    // 🆕 תיקון חדש: אם המודל בדיוק נסגר, לא לעשות כלום!
    if (modalJustClosed.current) {
      console.log('🚪 מודל בדיוק נסגר - מדלג על עיבוד');
      lastProcessedParams.current = { id, vendorId, pathname };
      return;
    }
    
    // בדיקה אם יש שינוי אמיתי בפרמטרים
    const hasRealChange = (
      lastProcessedParams.current.id !== id || 
      lastProcessedParams.current.vendorId !== vendorId ||
      lastProcessedParams.current.pathname !== pathname
    );
    
    // 🛡️ מניעת עיבוד כפול
    if (isProcessing.current || !hasRealChange) {
      console.log('⏸️ מדלג על עיבוד:', { isProcessing: isProcessing.current, hasRealChange });
      return;
    }
    
    console.log('🔄 פרמטרים השתנו:', { 
      id, 
      vendorId, 
      pathname,
      selectedProduct: selectedProduct?._id,
      isModalOpen 
    });
    
    isProcessing.current = true;
    lastProcessedParams.current = { id, vendorId, pathname };
    
    const processParams = async () => {
      try {
        // 🆕 אם יש מוכר בנתיב - בחר את המוכר
        if (vendorId && pathname.includes('/vendor/')) {
          console.log('🏪 מזהה מוכר בנתיב:', vendorId);
          
          // 🔧 תיקון חדש: בדוק אם המוכר כבר נבחר
          if (vendorFilterMode && currentVendorInfo?._id === vendorId) {
            console.log('✅ מוכר כבר נבחר - מדלג על בחירה מחדש');
          } else {
            // מצא את המוכר ברשימת המוכרים
            const vendor = filterOptions.vendors.find(v => v._id === vendorId);
            
            if (vendor) {
              console.log('✅ מוכר נמצא:', vendor.fullName);
              // 🔧 עדכון מיידי של הסטטוס כדי למנוע אתחול כפול
              await selectVendor(vendor);
            } else {
              console.log('⚠️ מוכר לא נמצא ברשימה, טוען באמצעות loadVendorProducts');
              // 🔧 טעינה ישירה של מוצרי מוכר
              await loadVendorProducts(vendorId);
            }
          }
          
          // 🔧 חשוב: אם יש גם מוצר ספציפי ואין מודל פתוח
          if (id && !isModalOpen) {
            console.log('🎯 פותח מוצר ספציפי של המוכר:', id);
            // 🔧 דיליי ארוך יותר כדי לוודא שהמוצרים נטענו
            setTimeout(async () => {
              console.log('⏰ מפעיל navigateToSpecificProduct אחרי דיליי');
              await navigateToSpecificProduct(id);
            }, 500);
          }
        }
        // אם יש מוצר ספציפי ואין מודל פתוח (לא בנתיב מוכר)
        else if (id && pathname.includes('/product/') && !isModalOpen) {
          console.log('🎯 פותח מוצר ספציפי רגיל:', id);
          await navigateToSpecificProduct(id);
        }
        // אם זה עמוד מוצרים רגיל
        else if (pathname === '/products' || pathname === '/') {
          console.log('📋 עמוד מוצרים רגיל');
          // כבר יטען מהקונטקסט (אם לא נחסם)
        }
      } catch (error) {
        console.error('❌ שגיאה בעיבוד פרמטרים:', error);
      } finally {
        // שחרור הנעילה אחרי דיליי ארוך יותר
        setTimeout(() => {
          console.log('🔓 משחרר נעילת עיבוד');
          isProcessing.current = false;
        }, 1000);
      }
    };
    
    processParams();
  }, [
    params.id, 
    params.vendorId, 
    location.pathname,
    isModalOpen, // 🔧 הוסף isModalOpen כתלות
    vendorFilterMode, // 🔧 הוסף vendorFilterMode כתלות
    currentVendorInfo?._id, // 🔧 הוסף currentVendorInfo._id כתלות
    selectVendor,
    filterOptions.vendors,
    navigateToSpecificProduct,
    loadVendorProducts,
    selectedProduct
  ]);
  
  return children;
};

export default ProductViewerWrapper;
// // src/components/common/ProductViewerWrapper.jsx - גרסה פשוטה
// import React, { useEffect } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import { useProductViewer } from '../../contexts/ProductViewerContext';

// const ProductViewerWrapper = ({ children }) => {
//   const { id, vendorId } = useParams();
//   const location = useLocation();
//   const { 
//     navigateToSpecificProduct, 
//     loadVendorProducts,
//     isModalOpen
//   } = useProductViewer();
  
//   useEffect(() => {
//     // אם המודאל פתוח, לא לעשות כלום
//     if (isModalOpen) return;
    
//     // טיפול בנתיב vendor
//     if (vendorId && location.pathname.includes('/vendor/')) {
//       console.log('🏪 Loading vendor:', vendorId);
//       loadVendorProducts(vendorId).then(() => {
//         // אם יש גם מוצר ספציפי
//         if (id) {
//           setTimeout(() => {
//             navigateToSpecificProduct(id);
//           }, 300);
//         }
//       });
//     }
//     // טיפול במוצר ספציפי רגיל
//     else if (id && location.pathname.includes('/product/')) {
//       console.log('📦 Loading product:', id);
//       navigateToSpecificProduct(id);
//     }
//   }, [id, vendorId, location.pathname]);
  
//   return children;
// };

// export default ProductViewerWrapper;