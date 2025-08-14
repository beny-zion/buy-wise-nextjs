'use client';

// components/navigation/ProfileCircle.jsx - מתוקן לNext.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // תיקון: next/navigation
import { useAuth } from '@/contexts/AuthContext';
import { User, LogIn, UserCircle, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';

const ProfileCircle = ({ isNavbar = false }) => {
  const { user, logout, mockLogin } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (user) {
      if (isNavbar) {
        setShowDropdown(!showDropdown);
      } else {
        router.push('/profile');
      }
    } else {
      router.push('/login');
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    router.push('/profile');
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const handleMockLogin = () => {
    mockLogin(); // לבדיקות
    setShowDropdown(false);
  };

  // תצוגה בניווט העליון
  if (isNavbar) {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden
                     hover:scale-105 transition-transform duration-200 relative"
        >
          {user?.profileImage ? (
            <Image 
              src={user.profileImage} 
              alt="פרופיל"
              width={40}
              height={40}
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {/* Tooltip */}
        {showTooltip && !showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
            {user ? user.fullName || 'אזור אישי' : 'התחברות'}
          </div>
        )}

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <UserCircle size={16} />
                  <span>פרופיל אישי</span>
                </button>
                
                <button
                  onClick={handleProfileClick}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <Settings size={16} />
                  <span>הגדרות</span>
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-red-600"
                >
                  <LogOut size={16} />
                  <span>התנתקות</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <LogIn size={16} />
                  <span>התחברות</span>
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={handleMockLogin}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-blue-600"
                >
                  <User size={16} />
                  <span>התחברות לדוגמה</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* מסכה לסגירת ה-dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        )}
      </div>
    );
  }

  // תצוגה בפינה התחתונה (המקורית)
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        className="relative w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden
                   border border-gray-200 hover:border-orange-500 transition-colors"
      >
        {user?.profileImage ? (
          <Image 
            src={user.profileImage} 
            alt="פרופיל"
            width={48}
            height={48}
            className="w-full h-full object-cover" 
          />
        ) : (
          <User className="w-6 h-6 text-gray-600" />
        )}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                      bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
          {user ? user.fullName || 'אזור אישי' : 'התחברות'}
        </div>
      )}
    </div>
  );
};

export default ProfileCircle;