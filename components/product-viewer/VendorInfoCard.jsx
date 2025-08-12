// src/components/product-viewer/VendorInfoCard.jsx - 📱 רספונסיבי מלא עם Tailwind בלבד
import React, { useCallback } from 'react';
import { Share2, ExternalLink, Star, Package, CheckCircle } from 'lucide-react';

/**
 * 🏪 VendorInfoCard - כרטיס ביקור מוכר רספונסיבי מלא עם Tailwind בלבד
 * 
 * Breakpoints:
 * - Mobile: < 640px (sm)
 * - Tablet: 640px - 1024px (sm to lg)
 * - Desktop: > 1024px (lg+)
 */
const VendorInfoCard = React.memo(({ vendor, className = '' }) => {
  // פונקציית שיתוף מוכר
  const handleVendorShare = useCallback(async () => {
    const vendorUrl = `${window.location.origin}/vendor/${vendor._id}`;
    const shareData = {
      title: `${vendor.fullName} - המלצות מוצרים איכותיות`,
      text: vendor.bio || 'מציע המלצות איכותיות למוצרים מובחרים',
      url: vendorUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        console.log('🔗 שיתוף מוכר בוצע בהצלחה');
      } else {
        await navigator.clipboard.writeText(vendorUrl);
        console.log('📋 קישור מוכר הועתק ללוח');
      }
    } catch (error) {
      console.error('❌ שגיאה בשיתוף מוכר:', error);
      try {
        await navigator.clipboard.writeText(vendorUrl);
        console.log('📋 קישור מוכר הועתק ללוח (fallback)');
      } catch (clipboardError) {
        console.error('❌ שגיאה בהעתקה ללוח:', clipboardError);
      }
    }
  }, [vendor._id, vendor.fullName, vendor.bio]);

  // פונקציית פתיחת דף המוכר בחלונית חדשה
  const openVendorPage = useCallback(() => {
    const vendorUrl = `/vendor/${vendor._id}`;
    window.open(vendorUrl, '_blank');
  }, [vendor._id]);

  if (!vendor) return null;
  
  return (
    <div className={`w-full max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 mt-6 sm:mt-8 lg:mt-12
                    bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 
                    backdrop-blur-md rounded-xl sm:rounded-2xl 
                    shadow-lg sm:shadow-xl border border-white/20 
                    p-3 sm:p-4 lg:p-6 
                    transition-all duration-300 hover:shadow-2xl ${className}`}>
      
      {/* פריסה עיקרית - מובייל: עמודות, דסקטופ: שורות */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
        
        {/* תמונת פרופיל עם בדג */}
        <div className="relative flex-shrink-0 self-start sm:self-center">
          <img
            src={vendor.profileImage || '/default-avatar.png'}
            alt={vendor.fullName}
            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 
                     rounded-xl lg:rounded-2xl object-cover 
                     ring-2 sm:ring-3 lg:ring-4 ring-white shadow-lg
                     transition-transform duration-300 hover:scale-105"
          />
          {/* בדג מוכר מאומת */}
          <div className="absolute -bottom-1 -right-1 
                         w-5 h-5 lg:w-6 lg:h-6 
                         bg-green-500 rounded-full 
                         flex items-center justify-center 
                         ring-2 ring-white shadow-lg">
            <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-white fill-current" />
          </div>
        </div>

        {/* תוכן ראשי */}
        <div className="flex-1 min-w-0">
          
          {/* כותרת וכפתורים */}
          <div className="flex items-start justify-between gap-3 mb-2 sm:mb-1">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 
                           truncate leading-tight">
                {vendor.fullName}
              </h2>
            </div>
            
            {/* כפתורי פעולה - תמיד בצד */}
            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={handleVendorShare}
                className="p-2 sm:p-2.5 lg:p-3 
                         bg-white/60 hover:bg-white/80 
                         backdrop-blur-sm rounded-lg sm:rounded-xl 
                         shadow-md hover:shadow-lg 
                         transition-all duration-200 
                         hover:scale-105 active:scale-95
                         group border border-white/20
                         min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="שתף מוכר"
                aria-label="שתף מוכר"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 
                                text-[#FFA066] group-hover:text-[#FF6B6B] 
                                transition-colors duration-200" />
              </button>

              <button
                onClick={openVendorPage}
                className="p-2 sm:p-2.5 lg:p-3 
                         bg-white/60 hover:bg-white/80 
                         backdrop-blur-sm rounded-lg sm:rounded-xl 
                         shadow-md hover:shadow-lg 
                         transition-all duration-200 
                         hover:scale-105 active:scale-95
                         group border border-white/20
                         min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="פתח דף מוכר בחלונית חדשה"
                aria-label="פתח דף מוכר"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 
                                      text-[#5C9EFF] group-hover:text-[#4A90E2] 
                                      transition-colors duration-200" />
              </button>
            </div>
          </div>

          {/* תיאור מוכר */}
          {vendor.bio && (
            <p className="text-sm sm:text-base text-gray-600 
                         mb-3 sm:mb-4 leading-relaxed
                         line-clamp-2 sm:line-clamp-3">
              {vendor.bio}
            </p>
          )}
          
          {/* סטטיסטיקות */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 
                           text-xs sm:text-sm 
                           bg-white/60 hover:bg-white/80 
                           px-2.5 sm:px-3 py-1 sm:py-1.5 
                           rounded-full transition-colors duration-200">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#FFA066]" />
              <span className="font-medium whitespace-nowrap">
                {vendor.productCount || 0} מוצרים
              </span>
            </span>
            
            {vendor.avgRating && (
              <span className="flex items-center gap-1.5 
                             text-xs sm:text-sm 
                             bg-white/60 hover:bg-white/80 
                             px-2.5 sm:px-3 py-1 sm:py-1.5 
                             rounded-full transition-colors duration-200">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span className="font-medium whitespace-nowrap">
                  {vendor.avgRating}/5
                </span>
              </span>
            )}

            {/* תאריך הצטרפות - רק בטאבלט ומעלה */}
            {vendor.createdAt && (
              <span className="hidden md:inline-flex 
                             text-xs text-gray-500 
                             bg-white/40 px-2 py-1 rounded-full">
                מצטרף מאז {new Date(vendor.createdAt).toLocaleDateString('he-IL', { 
                  year: 'numeric', 
                  month: 'short' 
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* רשתות חברתיות - נפרד בבלוק */}
      {vendor.social && Object.keys(vendor.social).length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 
                       border-t border-white/30">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-600 font-medium 
                           mb-1 sm:mb-0">
              עקבו אחרי:
            </span>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              
              {vendor.social.instagram && (
                <a
                  href={vendor.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 
                           bg-gradient-to-r from-purple-500 to-pink-500 
                           text-white rounded-lg 
                           hover:scale-110 active:scale-95
                           transition-all duration-200 
                           shadow-md hover:shadow-lg
                           min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
                           flex items-center justify-center"
                  title="Instagram"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {vendor.social.facebook && (
                <a
                  href={vendor.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 
                           bg-blue-600 text-white rounded-lg 
                           hover:scale-110 active:scale-95
                           transition-all duration-200 
                           shadow-md hover:shadow-lg
                           min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
                           flex items-center justify-center"
                  title="Facebook"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {vendor.social.tiktok && (
                <a
                  href={vendor.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 
                           bg-black text-white rounded-lg 
                           hover:scale-110 active:scale-95
                           transition-all duration-200 
                           shadow-md hover:shadow-lg
                           min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
                           flex items-center justify-center"
                  title="TikTok"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.946-1.222-2.058-1.032-3.109h-2.906v13.926c0 .972-.383 1.861-1.056 2.515-.661.641-1.556 1.009-2.485 1.009-1.933 0-3.541-1.608-3.541-3.541 0-1.933 1.608-3.541 3.541-3.541.201 0 .399.018.591.053v-2.962a6.516 6.516 0 00-.591-.026c-3.541 0-6.503 2.962-6.503 6.503s2.962 6.503 6.503 6.503c3.541 0 6.503-2.962 6.503-6.503V8.987a9.088 9.088 0 004.804 1.371V7.382c-1.085 0-2.116-.352-2.949-.978-.413-.311-.777-.684-1.079-1.108z"/>
                  </svg>
                </a>
              )}

              {vendor.social.youtube && (
                <a
                  href={vendor.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2 
                           bg-red-600 text-white rounded-lg 
                           hover:scale-110 active:scale-95
                           transition-all duration-200 
                           shadow-md hover:shadow-lg
                           min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]
                           flex items-center justify-center"
                  title="YouTube"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

VendorInfoCard.displayName = 'VendorInfoCard';

export default VendorInfoCard;