/* needed */
// src/components/profile/ProfileEditForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ImageUploader from '../common/ImageUploader';

const ProfileEditForm = ({ user, onSave }) => {
  const { updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    bio: user.bio || '',
    social: {
      instagram: user.social?.instagram || '',
      facebook: user.social?.facebook || '',
      tiktok: user.social?.tiktok || ''
    },
    profileImage: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('fullName', formData.fullName);
      form.append('bio', formData.bio);
      
      // הוספת רשתות חברתיות
      if (formData.social?.instagram) form.append('social[instagram]', formData.social.instagram);
      if (formData.social?.facebook) form.append('social[facebook]', formData.social.facebook);
      if (formData.social?.tiktok) form.append('social[tiktok]', formData.social.tiktok);
      
      // בדיקות לוג
      console.log("Bio to submit:", formData.bio);
      
      if (formData.profileImage) {
        console.log("Uploading image:", formData.profileImage.name);
        form.append('profileImage', formData.profileImage);
      }
      
      // לוג של כל הנתונים בטופס
      for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
      }
        
      const response = await updateUserProfile(form);
      console.log("Update response:", response);
      onSave();
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  // טיפול בשינוי רשתות חברתיות
  const handleSocialChange = (platform, value) => {
    setFormData({
      ...formData,
      social: {
        ...formData.social,
        [platform]: value
      }
    });
  };

  return (
    <div className="w-full max-w-screen-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {/* מציין חיבור Google */}
        <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2 mb-4">
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-600">
            חשבון מחובר באמצעות Google - {user.email}
          </span>
        </div>

        {/* Image Uploader */}
        <div className="flex justify-center">
          <ImageUploader 
            currentImage={user.profileImage}
            setFormData={setFormData}
          />
        </div>
        
        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 
                       rounded-xl focus:ring-2 focus:ring-[#FFA066] focus:border-[#FFA066]
                       placeholder-gray-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ספר לנו קצת על עצמך...</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 
                       rounded-xl focus:ring-2 focus:ring-[#FFA066] focus:border-[#FFA066]
                       placeholder-gray-400 transition-all duration-200 min-h-[120px]"
              rows={4}
              placeholder="תן לאנשים להכיר אותך טוב יותר..."
            />
          </div>

          {/* רשתות חברתיות */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">רשתות חברתיות</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Instagram</span>
                <input
                  type="text"
                  value={formData.social?.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="קישור לפרופיל אינסטגרם"
                  className="flex-1 px-4 py-2 bg-white/50 border border-gray-200 
                           rounded-xl focus:ring-2 focus:ring-[#FFA066] focus:border-[#FFA066]"
                />
              </div>
              
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Facebook</span>
                <input
                  type="text"
                  value={formData.social?.facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="קישור לפרופיל פייסבוק"
                  className="flex-1 px-4 py-2 bg-white/50 border border-gray-200 
                           rounded-xl focus:ring-2 focus:ring-[#FFA066] focus:border-[#FFA066]"
                />
              </div>
              
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">TikTok</span>
                <input
                  type="text"
                  value={formData.social?.tiktok || ''}
                  onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                  placeholder="קישור לפרופיל טיקטוק"
                  className="flex-1 px-4 py-2 bg-white/50 border border-gray-200 
                           rounded-xl focus:ring-2 focus:ring-[#FFA066] focus:border-[#FFA066]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
                     text-white font-medium rounded-xl shadow-md
                     hover:shadow-lg transform hover:-translate-y-0.5
                     transition-all duration-200 disabled:opacity-50
                     disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                שומר שינויים...
              </span>
            ) : 'שמור שינויים'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;