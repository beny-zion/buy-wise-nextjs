'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ProductModalContext = createContext({});

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context) {
    return { 
      isModalOpen: false, 
      selectedProduct: null, 
      openModal: () => {}, 
      closeModal: () => {} 
    };
  }
  return context;
};

export const ProductModalProvider = ({ children, value }) => {
  const [defaultState] = useState({
    isModalOpen: false,
    selectedProduct: null,
    openModal: () => {},
    closeModal: () => {}
  });

  return (
    <ProductModalContext.Provider value={value || defaultState}>
      {children}
    </ProductModalContext.Provider>
  );
};
