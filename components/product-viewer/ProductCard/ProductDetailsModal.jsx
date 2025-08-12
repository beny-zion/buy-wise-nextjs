/* needed */
// components/ProductViewer/ProductCard/ProductDetailsModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ShoppingCart, ZoomIn, X, ChevronLeft, ChevronRight, Star, Heart, Sparkles } from 'lucide-react';
import EnhancedImageGallery from './EnhancedImageGallery';
import { formatPrice } from '../../../utils/formatters';
import CommentSection from '../../comments/CommentSection';

/**
 * רכיב מודאל פרטי המוצר - משתמש ב-React Portal לרינדור מחוץ להיררכיית ה-DOM הרגילה
 */
const ProductDetailsModal = ({ product, onClose, onBuyClick, onShareClick, productImages = [] }) => {
    // ניהול סטייט
    const [activeTab, setActiveTab] = useState('details');
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // רפרנסים לאלמנטים
    const modalRef = useRef(null);
    
    // בדיקה אם יש וידאו
    const hasVideo = !!(
        (product?.aliExpressData?.product_video_url) || 
        (product?.videos && product?.videos.length > 0)
    );
    
    const videoUrl = 
        product?.aliExpressData?.product_video_url || 
        (product?.videos && product?.videos.length > 0 ? product?.videos[0] : null);

    // טיפול בלחיצת מקש Escape
    useEffect(() => {
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                if (fullscreenImage !== null) {
                    setFullscreenImage(null);
                } else {
                    onClose();
                }
            }
        };
    
        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [onClose, fullscreenImage]);

    // טיפול במניעת גלילה בגוף העמוד כשהמודל פתוח
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // פונקציה לפתיחת תמונה במסך מלא
    const handleImageClick = (index) => {
        setFullscreenImage(productImages[index]);
        setCurrentImageIndex(index);
    };

    // פונקציות ניווט בין תמונות
    const nextImage = () => {
        if (fullscreenImage && productImages.length > 1) {
            const newIndex = (currentImageIndex + 1) % productImages.length;
            setCurrentImageIndex(newIndex);
            setFullscreenImage(productImages[newIndex]);
        }
    };

    const prevImage = () => {
        if (fullscreenImage && productImages.length > 1) {
            const newIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
            setCurrentImageIndex(newIndex);
            setFullscreenImage(productImages[newIndex]);
        }
    };

    // התוכן של המודל
    const modalContent = (
        <>
            {/* תצוגת תמונה במסך מלא */}
            <AnimatePresence>
                {fullscreenImage && (
                    <motion.div 
                        className="fixed inset-0 z-[12000] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFullscreenImage(null)}
                    >
                        {/* כפתור סגירה */}
                        <motion.button
                            onClick={() => setFullscreenImage(null)}
                            className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-xl z-[12001] hover:bg-white/20 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="סגור תצוגת מסך מלא"
                        >
                            <X size={20} className="text-white" />
                        </motion.button>

                        {/* תמונה */}
                        <motion.img 
                            src={fullscreenImage} 
                            alt="תצוגת מסך מלא" 
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        />

                        {/* אינדיקטור תמונות */}
                        {productImages.length > 1 && (
                            <motion.div 
                                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-sm font-medium z-[12001]"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                {currentImageIndex + 1} / {productImages.length}
                            </motion.div>
                        )}

                        {/* כפתורי ניווט */}
                        {productImages.length > 1 && (
                            <>
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-xl text-white z-[12001] hover:bg-white/20 transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="תמונה קודמת"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                                <motion.button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-xl text-white z-[12001] hover:bg-white/20 transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="תמונה הבאה"
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* מודאל פרטי מוצר */}
            <motion.div 
                className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md z-[11000] flex justify-center p-4"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    ref={modalRef}
                    className="w-full max-w-md bg-white/95 backdrop-blur-xl overflow-hidden shadow-2xl z-[11001] 
                             flex flex-col relative rounded-3xl border border-white/20"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    style={{ maxHeight: '95vh' }}
                >
                    {/* כפתור סגירה */}
                    <motion.button
                        onClick={onClose}
                        className="absolute top-3 left-3 p-2 bg-white/10 backdrop-blur-md rounded-xl text-gray-700 z-30 hover:bg-white/20 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="סגור"
                    >
                        <X size={18} />
                    </motion.button>

                    {/* טאבים מעוצבים */}
                    <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-white/20">
                        <div className="flex p-1.5 gap-1.5">
                            <motion.button
                                className={`flex-1 py-2 px-3 font-medium text-sm rounded-xl transition-all relative overflow-hidden
                                    ${activeTab === 'details'
                                        ? 'text-white bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] shadow-md' 
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'}`}
                                onClick={() => setActiveTab('details')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-1.5">
                                    <Sparkles size={14} />
                                    פרטי מוצר
                                </span>
                            </motion.button>
                            <motion.button
                                className={`flex-1 py-2 px-3 font-medium text-sm rounded-xl transition-all relative overflow-hidden
                                    ${activeTab === 'comments'
                                        ? 'text-white bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] shadow-md' 
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'}`}
                                onClick={() => setActiveTab('comments')}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10">תגובות ושאלות</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* תוכן טאבים */}
                    <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {/* טאב פרטי מוצר */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'details' && (
                                <motion.div 
                                    dir="rtl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* גלריית תמונות */}
                                    <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 relative">
                                        {hasVideo ? (
                                            <div className="w-full h-full rounded-2xl overflow-hidden m-2" style={{ height: 'calc(100% - 16px)', width: 'calc(100% - 16px)' }}>
                                                <video
                                                    src={videoUrl}
                                                    controls
                                                    className="w-full h-full object-contain rounded-2xl"
                                                    poster={product?.displayImage || product?.imageUrl}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full">
                                                <EnhancedImageGallery 
                                                    images={productImages} 
                                                    layout="horizontal"
                                                    showControls={true}
                                                    showThumbnails={true}
                                                    onImageClick={handleImageClick}
                                                    isFullscreen={false}
                                                />
                                            </div>
                                        )}

                                        {/* כפתור זום */}
                                        {!hasVideo && productImages.length > 0 && (
                                            <motion.button
                                                onClick={() => handleImageClick(0)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/10 backdrop-blur-md rounded-lg text-gray-700 z-20 hover:bg-white/20 transition-all"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                aria-label="הגדל לתצוגת מסך מלא"
                                            >
                                                <ZoomIn size={16} />
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* פרטי מוצר */}
                                    <div className="p-6 space-y-6">
                                        {/* כותרת מוצר */}
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                                                {product?.title || 'פרטי מוצר'}
                                            </h2>
                                            
                                            {/* סטטיסטיקות ללא מחיר */}
                                            <div className="flex justify-end items-start">
                                                {/* // 🔧 מחיר הוסר זמנית */}
                                                {/* <div className="space-y-2">
                                                    <div className="text-3xl font-bold bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] bg-clip-text text-transparent">
                                                        {formatPrice(product?.aliExpressData?.price || 0)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        מחיר משוער - המחיר הסופי נקבע באתר אליאקספרס
                                                    </div>
                                                </div> */}

                                                <div className="text-left space-y-2">
                                                    {product?.aliExpressData?.stats?.rating && (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={16}
                                                                        className={i < Math.floor(product.aliExpressData.stats.rating) 
                                                                            ? "text-yellow-400 fill-yellow-400" 
                                                                            : "text-gray-300"}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-gray-700 font-medium">
                                                                {product.aliExpressData.stats.rating}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {product?.aliExpressData?.stats?.sales && (
                                                        <div className="text-sm text-gray-500">
                                                            {product.aliExpressData.stats.sales.toLocaleString()} נמכרו
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* קטגוריות */}
                                        {(product?.aliExpressData?.categories?.main?.name || product?.aliExpressData?.categories?.sub?.name) && (
                                            <div className="flex flex-wrap gap-2">
                                                {product?.aliExpressData?.categories?.main?.name && (
                                                    <span className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-2 rounded-xl border border-blue-200">
                                                        {product.aliExpressData.categories.main.name}
                                                    </span>
                                                )}
                                                {product?.aliExpressData?.categories?.sub?.name && (
                                                    <span className="text-sm bg-gradient-to-r from-green-50 to-teal-50 text-green-700 px-3 py-2 rounded-xl border border-green-200">
                                                        {product.aliExpressData.categories.sub.name}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* המלצת מוכר */}
                                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-5 rounded-2xl border border-orange-200 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-xl"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <img
                                                        src={product?.vendorId?.profileImage || '/default-avatar.png'}
                                                        alt={product?.vendorId?.fullName || 'ממליץ'}
                                                        className="w-12 h-12 rounded-2xl ring-2 ring-orange-200 shadow-md"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900">
                                                            המלצה של {product?.vendorId?.fullName || 'ממליץ'}
                                                        </div>
                                                        <div className="text-sm text-orange-600">
                                                           {product?.vendorId?.bio || 'מוכר מומחה'}
                                                            </div>
                                                    </div>
                                                    <Heart size={20} className="text-orange-500" />
                                                </div>
                                                <p className="text-gray-800 leading-relaxed">
                                                    {product?.recommendation || 'אין המלצה'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* טאב תגובות */}
                            {activeTab === 'comments' && (
                                <motion.div 
                                    dir="rtl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CommentSection 
                                        productId={product._id} 
                                        isVisible={activeTab === 'comments'} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* כפתורי פעולה קבועים בתחתית */}
                    <div className="w-full p-4 bg-white/80 backdrop-blur-xl border-t border-white/20 flex items-center gap-3" dir="rtl">
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onBuyClick();
                            }}
                            className="flex-1 bg-gradient-to-r from-[#FFA066] via-[#FF6B6B] to-[#8B5CF6] text-white py-3 px-4 rounded-xl 
                                     flex items-center justify-center gap-2 font-medium shadow-md
                                     transition-all duration-200 hover:shadow-lg relative overflow-hidden"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF8C3D] via-[#FF5252] to-[#7C3AED] opacity-0 hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <ShoppingCart size={18} />
                                קנה באלי אקספרס
                            </span>
                        </motion.button>
                        
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShareClick();
                            }}
                            className="p-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl text-gray-700
                                     flex items-center justify-center hover:bg-white transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="שתף מוצר"
                        >
                            <Share2 size={18} />
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );

    // שימוש ב-React Portal כדי להציג את המודל מחוץ להיררכיית ה-DOM הרגילה
    return createPortal(modalContent, document.body);
};

export default ProductDetailsModal;