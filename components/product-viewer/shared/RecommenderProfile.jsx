/* needed */
// components/ProductViewer/shared/RecommenderProfile.jsx
import React from 'react';

/**
 * רכיב להצגת פרופיל הממליץ
 * @param {Object} props - פרופס של הרכיב
 * @param {Object} props.vendor - אובייקט המוכר/ממליץ
 * @param {string} props.categoryName - שם הקטגוריה של המוצר
 * @param {boolean} props.showProfileInfo - האם להציג את פרטי הפרופיל המורחבים
 * @param {Function} props.onProfileClick - פונקציה לטיפול בלחיצה על תמונת הפרופיל
 * @param {Function} props.onProfileHover - פונקציה לטיפול בריחוף על תמונת הפרופיל
 * @param {Function} props.onProfileLeave - פונקציה לטיפול ביציאה מריחוף על תמונת הפרופיל
 */
const RecommenderProfile = ({
  vendor,
  categoryName,
  showProfileInfo,
  onProfileClick,
  onProfileHover,
  onProfileLeave
}) => {
  if (!vendor) return null;

  return (
    <div className="flex items-center gap-3 mb-4" dir="rtl">
      <div 
        className="relative"
        onMouseEnter={onProfileHover}
        onMouseLeave={onProfileLeave}
        onClick={onProfileClick}
      >
        <img
          src={vendor.profileImage || '/default-avatar.png'}
          alt={vendor.fullName || 'תמונת ממליץ'}
          className="w-12 h-12 rounded-full border-2 border-white/20 cursor-pointer"
        />
        
        {/* פופאפ פרטי ממליץ */}
        {showProfileInfo && (
          <div className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg w-48 z-30">
            <h4 className="font-medium">{vendor.fullName || 'ממליץ'}</h4>
            <p className="text-xs text-white/80 mt-1">{vendor.bio || 'ממליץ מוצרים'}</p>
          </div>
        )}
      </div>
      
      <div className="text-white">
        <div className="font-medium">{vendor.fullName || 'ממליץ'}</div>
        {categoryName && (
          <div className="text-xs text-white/80">
            {categoryName}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommenderProfile;