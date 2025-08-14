'use client';

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3333/full-products');
      if (response.ok) {
        const data = await response.json();
        console.log('Products loaded:', data.products?.length);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFA066] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          מוצרים מומלצים
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
              onClick={() => setSelectedProduct(product)}
            >
              {/* תמונה */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                {product.displayImage || product.imageUrl ? (
                  <img 
                    src={product.displayImage || product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">📦</span>
                  </div>
                )}
                
                {/* באדג' הנחה */}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              {/* תוכן */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[48px]">
                  {product.title}
                </h3>
                
                {product.recommendation && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.recommendation}
                  </p>
                )}
                
                {/* מחיר */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-[#FF6B6B]">
                      ₪{product.price || product.originalPrice || '0'}
                    </span>
                    {product.originalPrice && product.price && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₪{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                {/* כפתור */}
                <button className="w-full bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white py-2 rounded-lg hover:shadow-md transition-all duration-200 font-medium">
                  צפה במוצר
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">אין מוצרים להצגה</p>
          </div>
        )}
      </div>

      {/* Modal פשוט */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedProduct.title}
              </h2>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {selectedProduct.displayImage && (
              <img 
                src={selectedProduct.displayImage} 
                alt={selectedProduct.title}
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
            )}
            
            {selectedProduct.recommendation && (
              <p className="text-gray-600 mb-4">{selectedProduct.recommendation}</p>
            )}
            
            <div className="text-3xl font-bold text-[#FF6B6B] mb-4">
              ₪{selectedProduct.price || selectedProduct.originalPrice}
            </div>
            
            <button 
              className="w-full bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-lg"
              onClick={() => {
                if (selectedProduct.affiliateLink) {
                  window.open(selectedProduct.affiliateLink, '_blank');
                }
              }}
            >
              קנה עכשיו באלי אקספרס
            </button>
          </div>
        </div>
      )}
    </>
  );
}
