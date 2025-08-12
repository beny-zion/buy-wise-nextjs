/* needed */
import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const ImageUploader = ({ currentImage, setFormData }) => {
  const [previewImage, setPreviewImage] = useState(currentImage);

  // עדכון תצוגה מקדימה כאשר currentImage משתנה
  useEffect(() => {
    setPreviewImage(currentImage);
  }, [currentImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    // עדכון התמונה בפורם דאטא
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
 
    // יצירת URL לתצוגה מקדימה מיידית
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    
    console.log("תמונה נבחרה:", file.name);
  };
  
  // שחרור משאבי URL כשהקומפוננטה מתפרקת
  useEffect(() => {
    return () => {
      // בדיקה אם ה-URL הוא blob URL שיצרנו
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
 
  return (
    <div className="relative w-32 h-32 mx-auto mb-4">
      <img 
        src={previewImage || '/api/placeholder/128/128'} 
        alt="Profile"
        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-full">
        <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:scale-105">
          <Camera size={20} className="text-gray-700" />
          <input 
            type="file" 
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            name="profileImage"
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;