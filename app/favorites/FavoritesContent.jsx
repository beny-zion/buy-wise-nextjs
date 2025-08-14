'use client';

// app/favorites/FavoritesContent.jsx - תוכן המועדפים
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, Package, Star, ExternalLink } from 'lucide-react';
import ProductCard from '@/components/product-viewer/ProductCard/ProductCard';

const FavoritesContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState(generateMockFavorites());

  // אם אין משתמש מחובר, הפנה לעמוד ההתחברות
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleRemoveFavorite = (productId) => {
    setFavorites(prev => prev.filter(product => product._id !== productId));
  };

  const handleProductClick = (product) => {
    alert(`פתיחת פרטי מוצר: ${product.title}`);
  };

  const handleBuyClick = (product) => {
    const affiliateLink = product.aliExpressData?.affiliate_link;
    if (affiliateLink) {
      window.open(affiliateLink, '_blank');
    } else {
      alert('קישור לא זמין כרגע');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❤️</div>
          <p className="text-gray-600">טוען מועדפים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                המוצרים המועדפים שלי
              </h1>
              <p className="text-gray-600">
                {favorites.length} מוצרים שמורים במועדפים
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              אין מוצרים מועדפים
            </h3>
            <p className="text-gray-500 mb-6">
              התחל לחפש מוצרים ולהוסיף אותם למועדפים
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              עבור למוצרים
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart size={24} className="text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
                    <div className="text-sm text-gray-600">מוצרים מועדפים</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">💰</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₪{favorites.reduce((sum, product) => sum + (product.price || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">סה"כ ערך</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(favorites.reduce((sum, product) => sum + (product.rating || 0), 0) / favorites.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">דירוג ממוצע</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                המוצרים שלך
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onCardClick={handleProductClick}
                    onBuyClick={handleBuyClick}
                    onFavoriteClick={handleRemoveFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// נתונים דמיונליים למועדפים
function generateMockFavorites() {
  return [
    {
      _id: 'fav-1',
      title: 'אוזניות בלוטוט איכותיות',
      image: 'https://picsum.photos/400/400?random=201',
      price: 89,
      originalPrice: 149,
      rating: 4.8,
      reviewCount: 234,
      recommendation: 'אוזניות מעולות עם איכות צליל נהדרת',
      vendorId: { fullName: 'יוסי הטכנולוגיה' },
      aliExpressData: { affiliate_link: 'https://aliexpress.com/item/123456' }
    },
    {
      _id: 'fav-2',
      title: 'מטען אלחוטי מהיר',
      image: 'https://picsum.photos/400/400?random=202',
      price: 45,
      originalPrice: 79,
      rating: 4.6,
      reviewCount: 156,
      recommendation: 'מטען מהיר ונוח לשימוש יומיומי',
      vendorId: { fullName: 'דני אלקטרוניקה' },
      aliExpressData: { affiliate_link: 'https://aliexpress.com/item/789012' }
    },
    {
      _id: 'fav-3',
      title: 'מחזיק טלפון לרכב מגנטי',
      image: 'https://picsum.photos/400/400?random=203',
      price: 29,
      originalPrice: 49,
      rating: 4.7,
      reviewCount: 89,
      recommendation: 'פתרון מושלם לרכב',
      vendorId: { fullName: 'רועי רכב' },
      aliExpressData: { affiliate_link: 'https://aliexpress.com/item/345678' }
    }
  ];
}

export default FavoritesContent;