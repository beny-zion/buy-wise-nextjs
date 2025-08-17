'use client';

// // product-viewer/components/ProductFeed.jsx - ׳¢׳ Debug panel
// import React, { useEffect, useRef, useCallback } from 'react';
// import { useProductViewer } from '../../contexts/ProductViewerContext.jsx';
// import ProductCard from './ProductCard/index.jsx';
// import ProductDetailsModal from './ProductCard/ProductDetailsModal';
// import SearchConnector from '../common/SearchConnector.jsx';

// // נ› ׳§׳•׳׳₪׳•׳ ׳ ׳˜ Debug ׳–׳׳ ׳™ (׳”׳¡׳¨ ׳׳—׳¨׳™ ׳”׳×׳™׳§׳•׳)
// const PaginationDebug = () => {
//   const { 
//     products, 
//     loading, 
//     loadingMore, 
//     hasMore, 
//     searchMode, 
//     debugInfo,
//     loadMoreProducts 
//   } = useProductViewer();

//   // ׳”׳¦׳’ ׳¨׳§ ׳‘׳׳¦׳‘ ׳₪׳™׳×׳•׳—
//   if (process.env.NODE_ENV !== 'development') {
//     return null;
//   }

//   return (
//     <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
//       <div className="font-bold mb-2 text-yellow-400">נ› Pagination Debug</div>
      
//       <div className="space-y-1">
//         <div>נ“¦ Products: <span className="text-green-400">{products?.length || 0}</span></div>
//         <div>נ“„ Page: <span className="text-blue-400">{debugInfo?.page || 'N/A'}</span></div>
//         <div>נ”„ Loading: <span className={loading ? 'text-red-400' : 'text-green-400'}>{loading ? 'Yes' : 'No'}</span></div>
//         <div>ג• LoadMore: <span className={loadingMore ? 'text-red-400' : 'text-green-400'}>{loadingMore ? 'Yes' : 'No'}</span></div>
//         <div>נ“ HasMore: <span className={hasMore ? 'text-green-400' : 'text-red-400'}>{hasMore ? 'Yes' : 'No'}</span></div>
//         <div>נ” SearchMode: <span className={searchMode ? 'text-orange-400' : 'text-green-400'}>{searchMode ? 'Yes' : 'No'}</span></div>
//       </div>
      
//       <div className="mt-3 pt-2 border-t border-gray-600">
//         <button 
//           onClick={loadMoreProducts}
//           disabled={!hasMore || loadingMore || searchMode}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-2 py-1 rounded text-xs"
//         >
//           נ”„ Test Load More
//         </button>
//       </div>
      
//       {debugInfo && (
//         <div className="mt-2 pt-2 border-t border-gray-600 text-xs opacity-75">
//           <div>Debug: {JSON.stringify(debugInfo)}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * ׳¨׳›׳™׳‘ ׳×׳¦׳•׳’׳× ׳׳¦׳‘ ׳˜׳¢׳™׳ ׳”
//  */
// const LoadingState = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="w-12 h-12 relative">
//       <div className="absolute inset-0 border-4 border-t-[#FFA066] border-r-[#FF6B6B] border-b-[#5C9EFF] border-l-transparent rounded-full animate-spin" />
//     </div>
//   </div>
// );

// /**
//  * ׳¨׳›׳™׳‘ ׳×׳¦׳•׳’׳× ׳©׳’׳™׳׳”
//  */
// const ErrorState = ({ message }) => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="text-center px-4">
//       <div className="text-[#FF6B6B] text-lg mb-2 font-medium">׳©׳’׳™׳׳”</div>
//       <div className="text-gray-600">{message}</div>
//     </div>
//   </div>
// );

// /**
//  * ׳¨׳›׳™׳‘ ׳×׳¦׳•׳’׳” ׳›׳׳©׳¨ ׳׳™׳ ׳׳•׳¦׳¨׳™׳
//  */
// const EmptyState = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="text-center px-4">
//       <div className="text-[#FFA066] text-lg mb-2 font-medium">׳׳™׳ ׳׳•׳¦׳¨׳™׳</div>
//       <div className="text-gray-600">׳ ׳¡׳” ׳׳‘׳—׳•׳¨ ׳§׳˜׳’׳•׳¨׳™׳” ׳׳—׳¨׳×</div>
//     </div>
//   </div>
// );

// /**
//  * ׳¨׳›׳™׳‘ ׳›׳₪׳×׳•׳¨ ׳˜׳¢׳™׳ ׳× ׳¢׳•׳“
//  */
// const LoadMoreButton = ({ onClick, loading, hasMore, searchMode }) => {
//   // נ”§ ׳”׳•׳¡׳£ debug logging
//   console.log('LoadMoreButton render:', { hasMore, loading, searchMode });
  
//   // ׳׳ ׳×׳¦׳™׳’ ׳›׳₪׳×׳•׳¨ ׳׳ ׳׳ ׳—׳ ׳• ׳‘׳׳¦׳‘ ׳—׳™׳₪׳•׳©
//   if (searchMode) {
//     return null;
//   }
  
//   return (
//     <div className="flex justify-center py-8">
//       <button
//         onClick={onClick}
//         disabled={loading || !hasMore}
//         className="px-6 py-3 bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             <span>׳˜׳•׳¢׳...</span>
//           </div>
//         ) : (
//           '׳˜׳¢׳ ׳¢׳•׳“ ׳׳•׳¦׳¨׳™׳'
//         )}
//       </button>
//     </div>
//   );
// };

// /**
//  * ׳¨׳›׳™׳‘ ׳₪׳™׳“ ׳׳•׳¦׳¨׳™׳ ׳¨׳׳©׳™ - ׳×׳¦׳•׳’׳× ׳’׳¨׳™׳“
//  */
// const ProductFeed = () => {
//   const { 
//     loading,
//     error,
//     products,
//     selectedProduct,
//     isModalOpen,
//     loadingMore,
//     hasMore,
//     searchMode, // נ”§ ׳”׳•׳¡׳£ searchMode
//     loadMoreProducts,
//     openProductModal,
//     closeProductModal,
//     handleAffiliateClick
//   } = useProductViewer();

//   const observerRef = useRef();
//   const loadMoreRef = useRef(null);

//   // נ”§ ׳¢׳“׳›׳ Intersection Observer - ׳‘׳“׳•׳§ searchMode
//   useEffect(() => {
//     // ׳׳ ׳×׳₪׳¢׳™׳ auto-load ׳‘׳׳¦׳‘ ׳—׳™׳₪׳•׳©
//     if (!hasMore || loadingMore || searchMode) {
//       console.log('נ« ׳׳‘׳˜׳ Intersection Observer:', { hasMore, loadingMore, searchMode });
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//       return;
//     }

//     const options = {
//       root: null,
//       rootMargin: '400px',
//       threshold: 0.01
//     };

//     const callback = (entries) => {
//       if (entries[0].isIntersecting && hasMore && !loadingMore && !searchMode) {
//         console.log('נ”„ ׳˜׳•׳¢׳ ׳׳•׳¦׳¨׳™׳ ׳ ׳•׳¡׳₪׳™׳ ׳׳•׳˜׳•׳׳˜׳™׳×...');
//         loadMoreProducts();
//       }
//     };

//     observerRef.current = new IntersectionObserver(callback, options);

//     if (loadMoreRef.current) {
//       observerRef.current.observe(loadMoreRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [hasMore, loadingMore, searchMode, loadMoreProducts]); // נ”§ ׳”׳•׳¡׳£ searchMode
  
//   // ׳˜׳™׳₪׳•׳ ׳‘׳©׳™׳×׳•׳£
//   const handleShare = useCallback(() => {
//     if (navigator.share && selectedProduct) {
//       navigator.share({
//         title: selectedProduct.title || '׳׳•׳¦׳¨ ׳׳•׳׳׳¥',
//         url: window.location.href,
//       });
//     } else if (selectedProduct) {
//       navigator.clipboard.writeText(window.location.href);
//     }
//   }, [selectedProduct]);

//   // נ”§ ׳”׳“׳₪׳¡ debug info
//   console.log('ProductFeed render:', {
//     loading,
//     productsCount: products?.length,
//     hasMore,
//     loadingMore,
//     searchMode
//   });

//   if (loading && !products.length) return <LoadingState />;
//   if (error) return <ErrorState message={error} />;
//   if (!products.length) return <EmptyState />;

//   return (
//     <>
//       {/* ׳׳—׳‘׳¨ ׳‘׳™׳ ׳”׳—׳™׳₪׳•׳© ׳׳׳•׳¦׳¨׳™׳ */}
//       <SearchConnector />
      
//       {/* נ› Debug panel - ׳”׳¡׳¨ ׳׳—׳¨׳™ ׳”׳×׳™׳§׳•׳ */}
//       {/* <PaginationDebug /> */}
      
//       <div className="min-h-screen bg-gray-50 pt-20 pb-8">
//         {/* ׳’׳¨׳™׳“ ׳׳•׳¦׳¨׳™׳ */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <ProductCard 
//                 key={product._id} 
//                 product={product}
//                 onClick={() => openProductModal(product)}
//               />
//             ))}
//           </div>

//           {/* נ”§ ׳׳–׳•׳¨ ׳׳˜׳¢׳™׳ ׳× ׳¢׳•׳“ - ׳׳•׳×׳ ׳” ׳‘-searchMode */}
//           {!searchMode && hasMore && (
//             <div ref={loadMoreRef} className="mt-8">
//               {loadingMore ? (
//                 <div className="flex justify-center">
//                   <div className="w-8 h-8 border-4 border-t-[#FFA066] border-r-[#FF6B6B] border-b-[#5C9EFF] border-l-transparent rounded-full animate-spin" />
//                 </div>
//               ) : (
//                 <LoadMoreButton 
//                   onClick={loadMoreProducts} 
//                   loading={loadingMore}
//                   hasMore={hasMore}
//                   searchMode={searchMode}
//                 />
//               )}
//             </div>
//           )}
          
//           {/* נ”§ ׳”׳•׳“׳¢׳” ׳׳ ׳׳ ׳—׳ ׳• ׳‘׳׳¦׳‘ ׳—׳™׳₪׳•׳© */}
//           {searchMode && (
//             <div className="mt-8 text-center text-gray-500">
//               <div className="text-sm">׳׳¦׳‘ ׳—׳™׳₪׳•׳© - {products.length} ׳×׳•׳¦׳׳•׳×</div>
//             </div>
//           )}
//         </div>

//         {/* ׳׳•׳“׳׳ ׳₪׳¨׳˜׳™ ׳׳•׳¦׳¨ */}
//         {isModalOpen && selectedProduct && (
//           <ProductDetailsModal 
//             product={selectedProduct} 
//             onClose={closeProductModal} 
//             onBuyClick={() => {
//               handleAffiliateClick(selectedProduct._id);
//               window.open(selectedProduct.affiliateLink, '_blank');
//             }}
//             onShareClick={handleShare}
//             productImages={[
//               selectedProduct.displayImage || selectedProduct.imageUrl,
//               ...(selectedProduct.images || []),
//               ...(selectedProduct.aliExpressData?.images || [])
//             ].filter(Boolean)}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default ProductFeed;
// src/components/product-viewer/ProductFeed.jsx - נ€ ׳’׳¨׳¡׳” ׳׳¢׳•׳“׳›׳ ׳× ׳¢׳ VendorInfoCard ׳׳©׳•׳“׳¨׳’
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useProductModal } from '../../contexts/ProductModalContext';
import { useProductViewer } from '../../contexts/ProductViewerContext';
import ProductCard from './ProductCard/index.jsx';
import ProductDetailsModal from './ProductCard/ProductDetailsModal';
import VendorInfoCard from './VendorInfoCard.jsx'; // נ†• ׳™׳‘׳•׳ VendorInfoCard ׳”׳—׳“׳©

/**
 * ׳¨׳›׳™׳‘׳™ UI ׳₪׳©׳•׳˜׳™׳ ׳¢׳ React.memo
 */
const LoadingState = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
      <div className="absolute inset-0 border-4 border-t-[#FFA066] border-r-[#FF6B6B] border-b-[#5C9EFF] border-l-transparent rounded-full animate-spin" />
    </div>
  </div>
));

const ErrorState = React.memo(({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <div className="text-[#FF6B6B] text-lg sm:text-xl mb-2 font-medium">׳©׳’׳™׳׳”</div>
      <div className="text-gray-600 text-sm sm:text-base">{message}</div>
    </div>
  </div>
));

const EmptyState = React.memo(({ isSearchMode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="text-center max-w-md">
      <div className="text-[#FFA066] text-lg sm:text-xl mb-2 font-medium">
        {isSearchMode ? '׳׳ ׳ ׳׳¦׳׳• ׳×׳•׳¦׳׳•׳×' : '׳׳™׳ ׳׳•׳¦׳¨׳™׳'}
      </div>
      <div className="text-gray-600 text-sm sm:text-base">
        {isSearchMode ? '׳ ׳¡׳” ׳׳©׳ ׳•׳× ׳׳× ׳”׳—׳™׳₪׳•׳©' : '׳ ׳¡׳” ׳׳‘׳—׳•׳¨ ׳§׳˜׳’׳•׳¨׳™׳” ׳׳—׳¨׳×'}
      </div>
    </div>
  </div>
));

const LoadMoreButton = React.memo(({ onClick, loading }) => (
  <div className="flex justify-center py-6 sm:py-8">
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 sm:px-8 py-3 sm:py-4 
               bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
               text-white rounded-full font-medium 
               shadow-md hover:shadow-lg 
               transition-all duration-200 
               disabled:opacity-50 disabled:cursor-not-allowed
               hover:scale-105 active:scale-95
               text-sm sm:text-base
               min-h-[48px] min-w-[120px]"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="hidden sm:inline">׳˜׳•׳¢׳...</span>
        </div>
      ) : (
        '׳˜׳¢׳ ׳¢׳•׳“ ׳׳•׳¦׳¨׳™׳'
      )}
    </button>
  </div>
));

/**
 * נ€ ProductFeed ׳׳׳•׳₪׳˜׳׳– - ׳׳•׳ ׳¢ ׳›׳₪׳™׳׳•׳™׳•׳× ׳•׳¨׳™׳ ׳“׳•׳¨׳™׳ ׳׳™׳•׳×׳¨׳™׳
 * 
 * ׳©׳™׳ ׳•׳™׳™׳ ׳¢׳™׳§׳¨׳™׳™׳:
 * ג… ׳©׳™׳׳•׳© ׳‘-VendorInfoCard ׳”׳—׳“׳© ׳¢׳ ׳›׳₪׳×׳•׳¨ ׳©׳™׳×׳•׳£
 * ג… React.memo ׳׳›׳ ׳”׳¨׳›׳™׳‘׳™׳
 * ג… useMemo ׳׳›׳ ׳”׳—׳™׳©׳•׳‘׳™׳
 * ג… useCallback ׳׳₪׳•׳ ׳§׳¦׳™׳•׳×
 * ג… ׳”׳₪׳—׳×׳× console.log ׳׳¨׳׳” ׳׳™׳ ׳™׳׳׳™׳×
 * ג… optimized dependency arrays
 */
const ProductFeed = React.memo(({ 
  products: propProducts = [],
  loading: propLoading = false,
  hasMore: propHasMore = false,
  loadMore: propLoadMore,
  isSearchMode: propIsSearchMode = false,
  specificProduct,
  vendorInfo,
  error: propError,
  debug
}) => {
  const {
    selectedProduct,
    isModalOpen,
    openProductModal,
    closeProductModal,
    handleAffiliateClick,
    isProductFavorite,
    toggleFavorite
  } = useProductViewer();
  
  const observerRef = useRef();
  const loadMoreRef = useRef(null);
  const lastRenderTime = useRef(Date.now());
  
  // נ›¡ן¸ ׳ ׳×׳•׳ ׳™׳ ׳׳•׳’׳ ׳™׳ ׳¢׳ memoization
  const safeData = useMemo(() => ({
    products: Array.isArray(propProducts) ? propProducts : [],
    loading: Boolean(propLoading),
    hasMore: Boolean(propHasMore),
    isSearchMode: Boolean(propIsSearchMode),
    error: propError || null,
    loadMore: typeof propLoadMore === 'function' ? propLoadMore : null
  }), [propProducts, propLoading, propHasMore, propIsSearchMode, propError, propLoadMore]);
  
  // נ¯ Debug ׳׳•׳’׳‘׳ - ׳¨׳§ ׳›׳ 500ms
  const throttledDebug = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    const now = Date.now();
    if (now - lastRenderTime.current < 500) return null; // throttle
    
    lastRenderTime.current = now;
    return {
      productsCount: safeData.products.length,
      loading: safeData.loading,
      hasMore: safeData.hasMore,
      isSearchMode: safeData.isSearchMode,
      hasVendorInfo: Boolean(vendorInfo),
      timestamp: new Date().toLocaleTimeString()
    };
  }, [safeData.products.length, safeData.loading, safeData.hasMore, safeData.isSearchMode, vendorInfo]);
  
  // Log ׳¨׳§ ׳׳ ׳™׳© ׳©׳™׳ ׳•׳™ ׳׳©׳׳¢׳•׳×׳™
  useEffect(() => {
    if (throttledDebug) {
      console.log('נ¬ ProductFeed:', throttledDebug);
    }
  }, [throttledDebug]);
  
  // נ¯ Intersection Observer ׳׳׳•׳₪׳˜׳׳–
  useEffect(() => {
    if (!safeData.hasMore || !safeData.loadMore || safeData.isSearchMode || safeData.loading) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const options = {
      root: null,
      rootMargin: '400px',
      threshold: 0.01
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting && safeData.hasMore && !safeData.isSearchMode && !safeData.loading) {
        safeData.loadMore();
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [safeData.hasMore, safeData.loadMore, safeData.isSearchMode, safeData.loading]);
  
  // נ¯ ׳₪׳•׳ ׳§׳¦׳™׳™׳× ׳©׳™׳×׳•׳£ ׳׳׳•׳™׳™׳–׳×
  const handleShare = useCallback(() => {
    if (navigator.share && selectedProduct) {
      navigator.share({
        title: selectedProduct.title || '׳׳•׳¦׳¨ ׳׳•׳׳׳¥',
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard?.writeText(window.location.href);
      });
    } else if (selectedProduct) {
      navigator.clipboard?.writeText(window.location.href);
    }
  }, [selectedProduct]);
  
  // נ¯ ׳¨׳›׳™׳‘ ׳’׳¨׳™׳“ ׳׳•׳¦׳¨׳™׳ ׳׳׳•׳™׳™׳– - ׳¨׳¡׳₪׳•׳ ׳¡׳™׳‘׳™ ׳׳׳
  const ProductGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                   gap-4 sm:gap-5 lg:gap-6">
      {safeData.products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product}
          onClick={() => openProductModal(product)}
          isFavorite={isProductFavorite?.(product._id) || false}
          onToggleFavorite={() => toggleFavorite?.(product._id)}
        />
      ))}
    </div>
  ), [safeData.products, openProductModal, isProductFavorite, toggleFavorite]);
  
  // נ¯ ׳”׳—׳׳˜׳× ׳׳¦׳‘ ׳×׳¦׳•׳’׳”
  if (safeData.loading && safeData.products.length === 0) {
    return <LoadingState />;
  }
  
  if (safeData.error) {
    return <ErrorState message={safeData.error} />;
  }
  
  if (!safeData.loading && safeData.products.length === 0) {
    return <EmptyState isSearchMode={safeData.isSearchMode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* נ†• ׳›׳¨׳˜׳™׳¡ ׳׳•׳›׳¨ ׳׳©׳•׳“׳¨׳’ ׳¢׳ ׳›׳₪׳×׳•׳¨ ׳©׳™׳×׳•׳£ - ׳¢׳ ׳׳¨׳•׳•׳— ׳ ׳•׳¡׳£ ׳׳׳׳¢׳׳” */}
        {vendorInfo && (
          <VendorInfoCard 
            vendor={vendorInfo}
            className="animate-pulse-once mt-4 sm:mt-6" 
          />
        )}
        
        {/* Debug ׳׳•׳’׳‘׳ */}
        {process.env.NODE_ENV === 'development' && debug && (
          <div className="mb-4 p-2 sm:p-3 bg-yellow-100 rounded-lg text-xs sm:text-sm">
            <strong>Debug:</strong> {safeData.products.length} ׳׳•׳¦׳¨׳™׳ | 
            Search Mode: {safeData.isSearchMode ? 'Yes' : 'No'} |
            <span className="hidden sm:inline">
              Vendor: {vendorInfo?.fullName || 'None'} |
              Path: {debug.pathname}
            </span>
          </div>
        )}
        
        {/* ׳’׳¨׳™׳“ ׳׳•׳¦׳¨׳™׳ */}
        {ProductGrid}

        {/* ׳׳–׳•׳¨ ׳˜׳¢׳™׳ ׳× ׳¢׳•׳“ */}
        {!safeData.isSearchMode && safeData.hasMore && safeData.loadMore && (
          <div ref={loadMoreRef} className="mt-6 sm:mt-8">
            <LoadMoreButton 
              onClick={safeData.loadMore} 
              loading={safeData.loading}
            />
          </div>
        )}
        
        {/* ׳”׳•׳“׳¢׳” ׳‘׳׳¦׳‘ ׳—׳™׳₪׳•׳© */}
        {safeData.isSearchMode && (
          <div className="mt-6 sm:mt-8 text-center text-gray-500">
            <div className="text-sm sm:text-base">
              {safeData.products.length === 0 
                ? '׳׳ ׳ ׳׳¦׳׳• ׳×׳•׳¦׳׳•׳×' 
                : `׳ ׳׳¦׳׳• ${safeData.products.length} ׳×׳•׳¦׳׳•׳×`
              }
            </div>
          </div>
        )}
      </div>

      {/* ׳׳•׳“׳׳ ׳׳•׳¦׳¨ */}
      {isModalOpen && selectedProduct && (
        <ProductDetailsModal 
          product={specificProduct || selectedProduct} 
          onClose={closeProductModal} 
          onBuyClick={() => {
            handleAffiliateClick?.(selectedProduct._id);
            if (selectedProduct.affiliateLink) {
              window.open(selectedProduct.affiliateLink, '_blank');
            }
          }}
          onShareClick={handleShare}
          productImages={[
            selectedProduct.displayImage || selectedProduct.imageUrl,
            ...(selectedProduct.images || []),
            ...(selectedProduct.aliExpressData?.images || [])
          ].filter(Boolean)}
        />
      )}
    </div>
  );
});

ProductFeed.displayName = 'ProductFeed';

export default ProductFeed;
