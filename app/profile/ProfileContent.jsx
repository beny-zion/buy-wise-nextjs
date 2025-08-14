'use client';

// app/profile/ProfileContent.jsx - תוכן הפרופיל
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Settings, LogOut, Heart, Package } from 'lucide-react';
import Image from 'next/image';

const ProfileContent = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // אם אין משתמש מחובר, הפנה לעמוד ההתחברות
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">👤</div>
          <p className="text-gray-600">טוען פרופיל...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {user.profileImage ? (
                <Image 
                  src={user.profileImage} 
                  alt={user.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {user.fullName || 'משתמש'}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>חבר מאז ינואר 2025</span>
              </div>

              {user.isVendor && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    מוכר מאושר
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Settings size={16} />
                <span>עריכת פרופיל</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                <span>התנתקות</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">מוצרים מועדפים</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">הזמנות השבוע</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">₪847</div>
                <div className="text-sm text-gray-600">חיסכון החודש</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">פעילות אחרונה</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart size={16} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">הוספת למועדפים</div>
                <div className="text-sm text-gray-600">אוזניות בלוטוט איכותיות</div>
              </div>
              <div className="text-sm text-gray-500">לפני 2 שעות</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">רכישה חדשה</div>
                <div className="text-sm text-gray-600">כבל טעינה מהיר USB-C</div>
              </div>
              <div className="text-sm text-gray-500">אתמול</div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">עדכון פרופיל</div>
                <div className="text-sm text-gray-600">עדכנת את תמונת הפרופיל</div>
              </div>
              <div className="text-sm text-gray-500">לפני 3 ימים</div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
            <span>✅</span>
            <span className="font-medium">שלב 2 הושלם בהצלחה!</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            ניווט, חיפוש והתחברות עובדים כמו שצריך
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;