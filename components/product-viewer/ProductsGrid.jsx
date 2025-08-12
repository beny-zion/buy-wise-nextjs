// components/product-viewer/ProductsGrid.jsx
'use client';

import { useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function ProductsGrid({ 
  initialProducts = [], 
  totalProducts = 0,
  currentPage = 1 
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < totalProducts);
  
  // Load more products
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      const nextPage = page + 1;
      const response = await fetch(
        `/api/proxy/products?page=${nextPage}&limit=20`
      );
      
      if (!response.ok) throw new Error('Failed to load more products');
      
      const data = await response.json();
      
      setProducts(prev => [...prev, ...data.products]);
      setPage(nextPage);
      setHasMore(products.length + data.products.length < data.total);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, products.length]);
  
  // Infinite scroll hook
  const loadMoreRef = useInfiniteScroll(loadMore, {
    threshold: 0.5,
    enabled: hasMore && !loading,
  });
  
  // Empty state
  if (!products.length && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          לא נמצאו מוצרים
        </h3>
        <p className="text-gray-500">
          נסה לשנות את הפילטרים או לחפש משהו אחר
        </p>
      </div>
    );
  }
  
  return (
    <>
      {/* Products Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
          />
        ))}
      </div>
      
      {/* Load More Trigger */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="flex justify-center py-8"
        >
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">טוען עוד מוצרים...</span>
            </div>
          )}
        </div>
      )}
      
      {/* End of list message */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>זה כל המוצרים שיש לנו כרגע 🎉</p>
        </div>
      )}
    </>
  );
}