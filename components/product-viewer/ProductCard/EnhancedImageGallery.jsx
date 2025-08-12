/* needed */
// components/ProductViewer/ImageGallery/EnhancedImageGallery.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * רכיב גלריית תמונות משופר למוצרים
 * @param {Object} props - פרופים של הרכיב
 * @param {Array} props.images - מערך של URL של תמונות
 * @param {string} props.layout - סגנון תצוגה: 'horizontal' או 'vertical' (ברירת מחדל: 'horizontal')
 * @param {boolean} props.showControls - האם להציג כפתורי שליטה (ברירת מחדל: true)
 * @param {boolean} props.showThumbnails - האם להציג תמונות ממוזערות (ברירת מחדל: true)
 * @param {Function} props.onImageClick - פונקציה שתופעל בעת לחיצה על תמונה
 * @param {boolean} props.isFullscreen - האם במצב מסך מלא (ברירת מחדל: false)
 */
const EnhancedImageGallery = ({
  images = [],
  layout = 'horizontal',
  showControls = true,
  showThumbnails = true,
  onImageClick,
  isFullscreen = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  
  // סינון תמונות תקינות
  const filteredImages = images.filter(url => Boolean(url));
  
  // מעבר לתמונה הבאה
  const nextImage = (e) => {
    e?.stopPropagation();
    if (filteredImages.length <= 1) return;
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };
  
  // מעבר לתמונה הקודמת
  const prevImage = (e) => {
    e?.stopPropagation();
    if (filteredImages.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };
  
  // בחירת תמונה ספציפית
  const selectImage = (index) => {
    setCurrentIndex(index);
  };
  
  // איפוס טעינה בכל החלפת תמונה
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  // טיפול בניווט באמצעות מקלדת
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // טיפול בהחלקה באמצעות מגע
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // קביעת כיוון ההחלקה בהתאם לסוג התצוגה
    if (layout === 'horizontal') {
      if (Math.abs(deltaX) > 50) { // החלקה אופקית משמעותית
        deltaX > 0 ? nextImage() : prevImage();
      }
    } else {
      if (Math.abs(deltaY) > 50) { // החלקה אנכית משמעותית
        deltaY > 0 ? nextImage() : prevImage();
      }
    }
    
    setTouchStart(null);
  };
  
  // טיפול במצב שאין תמונות
  if (!filteredImages.length) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">אין תמונות זמינות</p>
      </div>
    );
  }
  
  // הגדרת אנימציות על פי סוג התצוגה
  const getAnimationProps = () => {
    if (layout === 'horizontal') {
      return {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
      };
    } else {
      return {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -100 }
      };
    }
  };
  
  return (
    <div 
      className="h-full w-full relative cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', height: '100%', width: '100%' }}
    >
      {/* תמונה ראשית */}
      <div className="h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`image-${currentIndex}`}
            {...getAnimationProps()}
            transition={{ duration: 0.3 }}
            className="h-full w-full flex items-center justify-center"
            onClick={() => onImageClick ? onImageClick(currentIndex) : null}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="w-8 h-8 border-4 border-t-[#FFA066] border-r-transparent border-gray-200 rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={filteredImages[currentIndex]} 
              alt={`תמונת מוצר ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
              onLoad={() => setIsLoading(false)}
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* תמונות ממוזערות - בתחתית התמונה */}
      {showThumbnails && filteredImages.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20">
          <div className="flex gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-full overflow-x-auto hide-scrollbar">
            {filteredImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  selectImage(index);
                }}
                className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 transition-all ${
                  index === currentIndex ? 'border-[#FFA066] scale-110' : 'border-white/50'
                }`}
              >
                <img 
                  src={image} 
                  alt={`תמונה ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* חיצים לניווט - בצדדים */}
      {showControls && filteredImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage(e);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20"
            aria-label="תמונה קודמת"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage(e);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors z-20"
            aria-label="תמונה הבאה"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      {/* אינדיקטור לתמונה נוכחית */}
      {filteredImages.length > 1 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs z-20">
          {currentIndex + 1} / {filteredImages.length}
        </div>
      )}
    </div>
  );
};

export default EnhancedImageGallery;