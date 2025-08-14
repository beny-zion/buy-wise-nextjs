'use client';

// app/products/ProductsGrid.jsx - גריד המוצרים
import React, { useState } from 'react';
import ProductCard from '@/components/product-viewer/ProductCard/ProductCard';

/**
 * 🎯 ProductsGrid - גריד המוצרים
 * Client Component שמציג את המוצרים בגריד ומטפל באינטראקציות
 */
const ProductsGrid = ({ products = [], hasMore = false, currentPage = 1 }) => {
  const [favorites, setFavorites] = useState(new Set());

  // טיפול בלחיצה על כרטיס מוצר
  const handleCardClick = (product) => {
    console.log('🔍 Product clicked:', product.title);
    // כאן נוסיף בשלב 3 פתיחת מודל
    alert(`פתיחת פרטי מוצר: ${product.title}`);
  };

  // טיפול בקנייה
  const handleBuyClick = (product) => {
    console.log('🛒 Buy clicked:', product.title);
    
    // פתיחת קישור אלי אקספרס
    const affiliateLink = product.aliExpressData?.affiliate_link;
    if (affiliateLink) {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    } else {
      alert('קישור לא זמין כרגע');
    }
  };

  // טיפול במועדפים
  const handleFavoriteClick = (productId) => {
    console.log('❤️ Favorite clicked:', productId);
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // אם אין מוצרים
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          לא נמצאו מוצרים
        </h3>
        <p className="text-gray-500">
          נסה לרענן את הדף או לחפש משהו אחר
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* מידע על התוצאות */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          נמצאו {products.length} מוצרים
        </h2>
        
        <div className="text-sm text-gray-500">
          דף {currentPage} {hasMore && '• יש עוד מוצרים'}
        </div>
      </div>

      {/* גריד המוצרים */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product._id || `product-${index}`}
            product={product}
            onCardClick={handleCardClick}
            onBuyClick={handleBuyClick}
            onFavoriteClick={handleFavoriteClick}
            isFavorite={favorites.has(product._id)}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* הודעה על טעינה נוספת */}
      {hasMore && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <span>📄</span>
            <span>יש עוד מוצרים להציג</span>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductsGrid;