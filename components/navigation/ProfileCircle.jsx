// components/navigation/ProfileCircle.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, LogOut, Heart, Package, HelpCircle, Plus } from 'lucide-react';

const ProfileCircle = ({ isNavbar = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.push('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: <Heart className="w-4 h-4" />,
      label: 'המועדפים שלי',
      path: '/favorites',
      requireAuth: true
    },
    {
      icon: <Package className="w-4 h-4" />,
      label: 'המוצרים שלי',
      path: '/vendor/products',
      requireAuth: true,
      vendorOnly: true
    },
    {
      icon: <Plus className="w-4 h-4" />,
      label: 'הוסף מוצר',
      path: '/vendor/add-product',
      requireAuth: true,
      vendorOnly: true
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: 'שאלות',
      path: '/vendor/questions',
      requireAuth: true,
      vendorOnly: true
    }
  ];

  const handleMenuClick = (path) => {
    if (!user && path !== '/') {
      router.push('/login');
    } else {
      router.push(path);
    }
    setIsOpen(false);
  };

  if (isNavbar) {
    // Compact version for navbar
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.fullName || 'Profile'}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFA066] to-[#FF6B6B] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-100 
                          min-w-[200px] py-2 z-50 animate-fadeIn">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  {/* Menu Items */}
                  {menuItems
                    .filter(item => !item.vendorOnly || user.role === 'vendor')
                    .map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleMenuClick(item.path)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 
                                 transition-colors text-right"
                        dir="rtl"
                      >
                        <span className="text-gray-600">{item.icon}</span>
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </button>
                    ))}
                  
                  {/* Logout */}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 
                               transition-colors text-right text-red-600"
                      dir="rtl"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">התנתק</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full px-4 py-3 text-center text-sm font-medium text-white 
                             bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] hover:shadow-md 
                             transition-all"
                  >
                    התחבר / הירשם
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </button>
    );
  }

  // Full version for floating button (if needed)
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFA066] to-[#FF6B6B] 
                   shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.fullName || 'Profile'}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};

export default ProfileCircle;