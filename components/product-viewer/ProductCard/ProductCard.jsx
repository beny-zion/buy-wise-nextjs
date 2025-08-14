'use client';

// components/product-viewer/ProductCard/ProductCard.jsx - מתוקן לNext.js
import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Star, ExternalLink, Share2 } from 'lucide-react';
import { formatPrice, formatRating, formatImageUrl } from '@/utils/formatters';

/**
 * 🎯 ProductCard - מתוקן לNext.js
 * קומפוננטה לתצוגת מוצר בגריד
 */
const ProductCard = ({ 
  product, 
  onCardClick, 
  onBuyClick, 
  onFavoriteClick, 
  isFavorite = false,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // נתונים בסיסיים של המוצר
  const {
    _id,
    title = 'מוצר ללא שם',
    image,
    images = [],
    price,
    originalPrice,
    rating,
    reviewCount,
    vendorId,
    recommendation,
    aliExpressData = {}
  } = product || {};

  // תמונה ראשית
  const mainImage = image || images[0] || aliExpressData.main_image;
  const formattedImageUrl = formatImageUrl(mainImage);

  // מחיר
  const displayPrice = price || aliExpressData.price || originalPrice;
  const hasDiscount = originalPrice && price && originalPrice > price;

  // מידע מוכר
  const vendorName = vendorId?.fullName || vendorId?.name || 'מוכר';
  const vendorImage = vendorId?.profileImage;

  // פונקציות טיפול באירועים
  const handleCardClick = (e) => {
    e.preventDefault();
    if (onCardClick) {
      onCardClick(product);
    }
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
    if (onBuyClick) {
      onBuyClick(product);
    } else if (aliExpressData.affiliate_link) {
      window.open(aliExpressData.affiliate_link, '_blank');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(_id);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 ${className}`}
      onClick={handleCardClick}
      dir="rtl"
    >
      {/* תמונת המוצר */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">טוען...</div>
          </div>
        )}
        
        {!imageError ? (
          <Image
            src={formattedImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={handleImageLoad}
            onError={handleImageError}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center p-4">
              <ExternalLink size={32} className="mx-auto mb-2" />
              <div className="text-xs">תמונה לא זמינה</div>
            </div>
          </div>
        )}

        {/* כפתור לייק */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
        </button>

        {/* תג הנחה */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            הנחה!
          </div>
        )}
      </div>

      {/* תוכן הכרטיס */}
      <div className="p-4">
        {/* מידע מוכר */}
        {vendorId && (
          <div className="flex items-center gap-2 mb-2">
            {vendorImage && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src={vendorImage}
                  alt={vendorName}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            )}
            <span className="text-sm text-gray-600 font-medium">{vendorName}</span>
          </div>
        )}

        {/* כותרת המוצר */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* המלצה */}
        {recommendation && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recommendation}
          </p>
        )}

        {/* דירוג */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{formatRating(rating)}</span>
            </div>
            {reviewCount && (
              <span className="text-xs text-gray-500">
                ({reviewCount} ביקורות)
              </span>
            )}
          </div>
        )}

        {/* מחיר */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {displayPrice && (
              <span className="text-lg font-bold text-orange-600">
                {formatPrice(displayPrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex gap-2">
          <button
            onClick={handleBuyClick}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            קנה עכשיו
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // כאן יהיה שיתוף בעתיד
            }}
            className="p-2 border border-gray-300 hover:border-gray-400 rounded-lg transition-colors duration-200"
          >
            <Share2 size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;