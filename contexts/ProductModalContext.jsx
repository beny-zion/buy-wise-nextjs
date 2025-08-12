// contexts/ProductModalContext.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ProductModalContext = createContext({});

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    throw new Error('useProductModal must be used within ProductModalProvider');
  }
  return context;
};

export const ProductModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalHistory, setModalHistory] = useState([]);
  
  // Open modal with product
  const openModal = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    
    // Add to history
    setModalHistory(prev => [...prev, product._id]);
    
    // Prevent body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }, []);
  
  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    
    // Re-enable body scroll
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    
    // Clear selected product after animation
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  }, []);
  
  // Navigate to product in modal
  const navigateToProduct = useCallback((product) => {
    setSelectedProduct(product);
    setModalHistory(prev => [...prev, product._id]);
  }, []);
  
  // Go back in modal history
  const goBack = useCallback(() => {
    if (modalHistory.length > 1) {
      const newHistory = [...modalHistory];
      newHistory.pop();
      const previousProductId = newHistory[newHistory.length - 1];
      
      // TODO: Fetch previous product data
      setModalHistory(newHistory);
    } else {
      closeModal();
    }
  }, [modalHistory, closeModal]);
  
  const value = {
    isModalOpen,
    selectedProduct,
    modalHistory,
    openModal,
    closeModal,
    navigateToProduct,
    goBack,
  };
  
  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
};