'use client';

// components/product-viewer/ProductCard.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Star, ShoppingCart, Eye } from 'lucide-react';
import { useProductModal } from '@/contexts/ProductModalContext';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { openModal } = useProductModal();
  
  // Handle share
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: product.title,
      text: product.recommendation || product.description,
      url: `${window.location.origin}/product/${product._id}`,
    };
    
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // Show toast notification
        console.log('Link copied!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  // Handle favorite toggle
  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Call API to save favorite
  };
  
  // Handle quick view
  const handleQuickView = (e) => {
    e.preventDefault();
    openModal(product);
  };
  
  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="card group relative"
    >
      <Link href={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                -{discountPercentage}%
              </span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleFavorite}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Add to favorites"
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'fill-secondary-500 text-secondary-500' : 'text-gray-600'
                }`}
              />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            
            <button
              onClick={handleQuickView}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* Product Image */}
          <div className="relative w-full h-full">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            
            {!imageError ? (
              <Image
                src={product.displayImage || product.imageUrl || '/placeholder.jpg'}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                priority={false}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <span className="text-gray-400">🖼️</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 min-h-[48px]">
            {product.title}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              {product.reviewCount && (
                <span className="text-sm text-gray-400">({product.reviewCount})</span>
              )}
            </div>
          )}
          
          {/* Vendor */}
          {product.vendor?.fullName && (
            <p className="text-sm text-gray-500 mb-3">
              מומלץ על ידי {product.vendor.fullName}
            </p>
          )}
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary-500">
              ₪{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₪{product.originalPrice}
              </span>
            )}
          </div>
          
          {/* CTA Button */}
          <button 
            className="w-full btn-primary text-sm flex items-center justify-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              // Navigate to product or open in AliExpress
              window.open(product.affiliateLink, '_blank');
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>קנה עכשיו</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
