'use client';

/* needed */

// components/home/navigation/ProfileCircle.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { User } from 'lucide-react';
import NotificationBadge from '../../notifications/NotificationBadge';

const ProfileCircle = ({ isNavbar = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  // ׳׳ ׳–׳” ׳‘׳ ׳‘ ׳‘׳¨, ׳”׳—׳–׳¨ ׳¨׳§ ׳׳× ׳”׳×׳•׳›׳ ׳׳׳ positioning
  if (isNavbar) {
    return (
      <div className="relative w-full h-full">
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={handleClick}
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden
                     hover:scale-105 transition-transform duration-200"
        >
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="׳₪׳¨׳•׳₪׳™׳"
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {/* ׳”׳•׳¡׳₪׳× ׳”׳×׳¨׳׳•׳× ׳׳׳•׳›׳¨׳™׳ - ׳¢׳›׳©׳™׳• ׳׳—׳•׳¥ ׳׳›׳₪׳×׳•׳¨ */}
        {user?.isVendor && (
          <div className="absolute -top-0.5 -right-0.5 z-10">
            <NotificationBadge />
          </div>
        )}
        
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
            {user ? '׳׳–׳•׳¨ ׳׳™׳©׳™' : '׳”׳×׳—׳‘׳¨׳•׳×'}
          </div>
        )}
      </div>
    );
  }

  // ׳”׳’׳¨׳¡׳” ׳”׳׳§׳•׳¨׳™׳× ׳׳₪׳™׳ ׳” ׳”׳×׳—׳×׳•׳ ׳”
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        className="relative w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden
                   border border-gray-200 hover:border-blue-500 transition-colors"
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="׳₪׳¨׳•׳₪׳™׳"
            className="w-full h-full object-cover" 
          />
        ) : (
          <User className="w-6 h-6 text-gray-600" />
        )}
        
        {/* ׳”׳•׳¡׳₪׳× ׳”׳×׳¨׳׳•׳× ׳׳׳•׳›׳¨׳™׳ */}
        {user?.isVendor && <NotificationBadge />}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                      bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
          {user ? '׳׳–׳•׳¨ ׳׳™׳©׳™' : '׳”׳×׳—׳‘׳¨׳•׳×'}
        </div>
      )}
    </div>
  );
};

export default ProfileCircle;
