/* needed */
// components/ProductViewer/shared/ActionButton.jsx
import React from 'react';

/**
 * רכיב כפתור פעולה כללי
 * @param {Object} props - פרופס של הרכיב
 * @param {Function} props.onClick - פונקציה לטיפול בלחיצה
 * @param {React.ReactNode} props.icon - אייקון להצגה
 * @param {string} props.label - תיאור הפעולה (עבור נגישות)
 * @param {React.ReactNode} props.children - תוכן נוסף
 * @param {string} props.variant - סוג העיצוב: 'primary', 'secondary' או 'transparent'
 * @param {string} props.className - קלאסים נוספים
 */
const ActionButton = ({
  onClick,
  icon,
  label,
  children,
  variant = 'transparent',
  className = ''
}) => {
  // יצירת מיפוי סטיילים לפי וריאנט
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] text-white',
    secondary: 'bg-white/80 text-gray-800 border border-gray-200',
    transparent: 'bg-black/30 backdrop-blur-sm text-white hover:bg-black/50'
  };

  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-full transition-colors ${variantStyles[variant]} ${className}`}
      aria-label={label}
    >
      {icon}
      {children}
    </button>
  );
};

export default ActionButton;