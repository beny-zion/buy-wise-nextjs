'use client';

/* needed */
// components/ProductViewer/ProductCard/index.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { useProductViewer } from '../../../contexts/ProductViewerContext';
import { formatPrice, truncateText } from '../../../utils/formatters';

/**
 * ׳¨׳›׳™׳‘ ׳›׳¨׳˜׳™׳¡ ׳׳•׳¦׳¨ ׳׳×׳¦׳•׳’׳× ׳’׳¨׳™׳“
 */
const ProductCard = ({ product, onClick }) => {
  const { 
    isProductFavorite,
    toggleFavorite,
    handleAffiliateClick
  } = useProductViewer();
  
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isFavorite = isProductFavorite(product._id);

  // ׳˜׳™׳₪׳•׳ ׳‘׳׳•׳¢׳“׳₪׳™׳
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    const result = await toggleFavorite(product._id);
    if (!result.success && result.message) {
      // ׳›׳׳ ׳׳₪׳©׳¨ ׳׳”׳•׳¡׳™׳£ ׳˜׳•׳¡׳˜ ׳”׳•׳“׳¢׳”
      console.log(result.message);
    }
  };

  // ׳˜׳™׳₪׳•׳ ׳‘׳§׳׳™׳§ ׳¢׳ ׳§׳™׳©׳•׳¨ ׳׳₪׳™׳׳™׳׳˜
  const handleBuyClick = (e) => {
    e.stopPropagation();
    handleAffiliateClick(product._id);
    window.open(product.affiliateLink, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ׳×׳׳•׳ ׳× ׳׳•׳¦׳¨ */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageError ? '/placeholder-image.jpg' : (product.displayImage || product.imageUrl)}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        
        {/* ׳©׳›׳‘׳× ׳׳•׳‘׳¨׳׳™׳™ ׳‘׳”׳•׳‘׳¨ */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium text-sm">
              ׳¦׳₪׳” ׳‘׳₪׳¨׳˜׳™׳
            </span>
          </div>
        </div>

        {/* ׳›׳₪׳×׳•׳¨ ׳׳•׳¢׳“׳₪׳™׳ */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
          aria-label={isFavorite ? '׳”׳¡׳¨ ׳׳׳•׳¢׳“׳₪׳™׳' : '׳”׳•׳¡׳£ ׳׳׳•׳¢׳“׳₪׳™׳'}
        >
          <Heart 
            size={20} 
            className={`transition-colors duration-200 ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* ׳₪׳¨׳˜׳™ ׳׳•׳¦׳¨ */}
      <div className="p-4">
        {/* ׳₪׳¨׳˜׳™ ׳׳׳׳™׳¥ */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={product.vendorId?.profileImage || '/default-avatar.png'}
            alt={product.vendorId?.fullName || '׳׳׳׳™׳¥'}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">
            {product.vendorId?.fullName || '׳׳׳׳™׳¥'}
          </span>
        </div>

        {/* נ”§ ׳”׳׳׳¦׳” ׳‘׳׳§׳•׳ ׳›׳•׳×׳¨׳× - ׳׳•׳’׳‘׳׳× ׳-80 ׳×׳•׳•׳™׳ */}
        <p className="font-medium text-gray-900 mb-3 line-clamp-3 min-h-[60px] leading-tight">
          {truncateText(product.recommendation || '׳׳™׳ ׳”׳׳׳¦׳”', 80)}
        </p>

        {/* ׳׳—׳™׳¨ ׳•׳“׳™׳¨׳•׳’ */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {/* נ”§ ׳׳—׳™׳¨ ׳‘׳׳ ׳’׳׳™׳× */}
            {/* <div className="text-xl font-bold text-gray-900"> */}
              {/* {formatPrice(product.aliExpressData?.price || 0)} */}
            {/* </div> */}
            {/* נ”§ ׳”׳¢׳¨׳× ׳׳—׳™׳¨ ׳׳©׳•׳¢׳¨ */}
            {/* <div className="text-xs text-gray-500 mt-1"> */}
              {/* ׳׳—׳™׳¨ ׳׳©׳•׳¢׳¨ */}
            {/* </div> */}
          </div>

          {product.aliExpressData?.stats?.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">ג˜…</span>
              <span className="text-sm text-gray-600">
                {product.aliExpressData.stats.rating}
              </span>
            </div>
          )}
        </div>

        {/* ׳›׳₪׳×׳•׳¨׳™ ׳₪׳¢׳•׳׳” */}
        <div className="flex gap-2">
          <button
            onClick={handleBuyClick}
            className="flex-1 bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white py-2 px-4 rounded-lg 
                     flex items-center justify-center gap-2 text-sm font-medium
                     hover:shadow-md transition-all duration-200"
          >
            <ShoppingCart size={16} />
            <span>׳§׳ ׳” ׳¢׳›׳©׳™׳•</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            aria-label="׳¦׳₪׳” ׳‘׳₪׳¨׳˜׳™׳"
          >
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
