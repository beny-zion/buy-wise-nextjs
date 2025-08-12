/* needed */
// components/ProductViewer/shared/PriceDisplay.jsx
import React from 'react';
import { formatPrice } from '../../../utils/formatters';

/**
 * רכיב להצגת מחירים
 * @param {Object} props - פרופס של הרכיב
 * @param {number} props.price - המחיר הנוכחי
 * @param {number} props.originalPrice - המחיר המקורי (לפני הנחה)
 * @param {string} props.discount - אחוז ההנחה כמחרוזת
 * @param {string} props.size - גודל המחיר: 'small', 'medium' או 'large'
 * @param {string} props.className - קלאסים נוספים
 */
const PriceDisplay = ({
  price = 0,
  originalPrice,
  discount,
  size = 'medium',
  className = ''
}) => {
  const priceClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };

  const originalPriceClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`mb-3 ${className}`}>
      <span className={`font-bold text-white ${priceClasses[size]}`}>
        {formatPrice(price)}
      </span>
      
      {originalPrice && originalPrice > price && (
        <span className={`text-white/60 line-through mr-2 ${originalPriceClasses[size]}`}>
          {formatPrice(originalPrice)}
        </span>
      )}
      
      {discount && (
        <span className="mr-2 text-sm font-medium bg-red-500 text-white px-2 py-0.5 rounded">
          {discount}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;