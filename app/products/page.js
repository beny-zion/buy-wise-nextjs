'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product-viewer/ProductCard';
import { ProductModalProvider } from '@/contexts/ProductModalContext';
import ProductDetailsModal from '@/components/product-viewer/ProductCard/ProductDetailsModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3333/full-products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 border-4 border-t-[#FFA066] border-r-[#FF6B6B] border-b-[#5C9EFF] border-l-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <ProductModalProvider value={{ isModalOpen, selectedProduct, openModal: handleProductClick, closeModal }}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </div>

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <ProductDetailsModal 
            product={selectedProduct} 
            onClose={closeModal}
          />
        )}
      </div>
    </ProductModalProvider>
  );
}
