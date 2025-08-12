// /* needed */
// // components/search/SearchResults.jsx - FIXED VERSION (With vendor card for both search and direct link)
// import React from 'react';
// import { X, Package, Filter, User, ExternalLink, Star, ShoppingBag } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useSearch } from '../../contexts/SearchContext';
// import { useProductViewer } from '../../contexts/ProductViewerContext';

// // 🆕 קומפוננטת כרטיס ביקור מוכר
// const VendorCard = ({ vendor, onClose }) => {
//   const vendorUrl = `${window.location.origin}/vendor/${vendor._id}`;
  
//   const copyToClipboard = async (text) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       // TODO: Add toast notification
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   };
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: -20, scale: 0.95 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 
//                  backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6"
//     >
//       <div className="flex items-start gap-6">
//         {/* תמונת פרופיל */}
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
//           className="relative"
//         >
//           <img
//             src={vendor.profileImage || '/default-avatar.png'}
//             alt={vendor.fullName}
//             className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
//           />
//           <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 
//                         rounded-full border-3 border-white shadow-lg flex items-center justify-center">
//             <div className="w-2 h-2 bg-white rounded-full"></div>
//           </div>
//         </motion.div>
        
//         {/* מידע המוכר */}
//         <div className="flex-1">
//           <div className="flex items-center justify-between mb-3">
//             <motion.h3
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-2xl font-bold text-gray-800"
//             >
//               {vendor.fullName}
//             </motion.h3>
            
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-xl transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
          
//           {/* סטטיסטיקות */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="flex items-center gap-6 mb-4"
//           >
//             <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl">
//               <ShoppingBag className="w-4 h-4 text-blue-600" />
//               <span className="text-sm font-semibold text-gray-700">
//                 {vendor.productCount || 0} מוצרים
//               </span>
//             </div>
            
//             {vendor.avgRating && (
//               <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl">
//                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                 <span className="text-sm font-semibold text-gray-700">
//                   {vendor.avgRating}/5
//                 </span>
//               </div>
//             )}
//           </motion.div>
          
//           {/* תיאור */}
//           {vendor.bio && (
//             <motion.p
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="text-gray-600 text-sm leading-relaxed mb-4 bg-white/40 p-3 rounded-xl"
//             >
//               {vendor.bio}
//             </motion.p>
//           )}
          
//           {/* כפתורי פעולה */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="flex gap-3"
//           >
//             <button
//               onClick={() => copyToClipboard(vendorUrl)}
//               className="flex items-center gap-2 bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
//                        text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200
//                        hover:scale-105 font-semibold"
//             >
//               <ExternalLink className="w-4 h-4" />
//               העתק קישור
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // קומפוננטת תוצאות חיפוש עדכנית
// const SearchResults = () => {
//   const { 
//     searchQuery, 
//     selectedVendor, // מחיפוש
//     clearSearch,
//     filters
//   } = useSearch();
  
//   const { 
//     products, 
//     currentVendorInfo, // מנתיב ישיר
//     vendorFilterMode 
//   } = useProductViewer();
  
//   // 🔧 בדיקה אם יש מוכר פעיל (מחיפוש או מנתיב ישיר)
//   const activeVendor = selectedVendor || currentVendorInfo;
  
//   // בדיקה אם יש חיפוש פעיל
//   const hasActiveSearch = searchQuery || 
//     filters.categories.length > 0 || 
//     filters.vendors.length > 0 ||
//     filters.priceRange.min !== null ||
//     filters.priceRange.max !== null ||
//     filters.minRating !== null ||
//     vendorFilterMode; // 🔧 גם אם יש מוכר פעיל
  
//   if (!hasActiveSearch) return null;
  
//   // יצירת טקסט תיאור החיפוש
//   const getSearchDescription = () => {
//     const parts = [];
    
//     if (searchQuery) {
//       parts.push(`"${searchQuery}"`);
//     }
    
//     if (filters.categories.length > 0) {
//       parts.push(`${filters.categories.length} קטגוריות`);
//     }
    
//     if (filters.vendors.length > 0) {
//       parts.push(`${filters.vendors.length} מוכרים`);
//     }
    
//     if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
//       const min = filters.priceRange.min || 0;
//       const max = filters.priceRange.max || '∞';
//       parts.push(`₪${min}-${max}`);
//     }
    
//     if (filters.minRating) {
//       parts.push(`דירוג ${filters.minRating}+`);
//     }
    
//     return parts.join(', ');
//   };
  
//   return (
//     <AnimatePresence>
//       {hasActiveSearch && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//           className="fixed top-16 left-0 right-0 z-30 px-4"
//         >
//           <div className="max-w-4xl mx-auto">
//             {/* 🔧 אם יש מוכר פעיל - הצג כרטיס ביקור */}
//             {activeVendor ? (
//               <VendorCard 
//                 vendor={activeVendor} 
//                 onClose={clearSearch} 
//               />
//             ) : (
//               /* תוצאות חיפוש רגילות */
//               <div className="bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="p-2 bg-[#FFA066]/10 rounded-lg">
//                     <Filter className="w-4 h-4 text-[#FFA066]" />
//                   </div>
                  
//                   <div className="flex-1">
//                     <div className="text-sm font-medium text-gray-900">
//                       תוצאות חיפוש
//                     </div>
//                     <div className="text-xs text-gray-500 mt-0.5">
//                       {getSearchDescription()} - {products.length} מוצרים
//                     </div>
//                   </div>
//                 </div>
                
//                 <button
//                   onClick={clearSearch}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-4 h-4 text-gray-500" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default SearchResults;
// components/search/SearchResults.jsx - מושבת - משתמשים ב-VendorInfoCard במקום
import React from 'react';

/**
 * 🚫 SearchResults מושבת - משתמשים ב-VendorInfoCard במקום
 * 
 * הקומפוננטה הזו הושבתה כי אנחנו משתמשים ב-VendorInfoCard
 * שמספק חוויה טובה יותר עם כפתור שיתוף ועיצוב משופר.
 */
const SearchResults = () => {
  // פשוט מחזיר null - הקומפוננטה לא תופיע
  return null;
};

export default SearchResults;