// // src/components/auth/GoogleAuthButton.jsx
// import React from 'react';

// const GoogleAuthButton = () => {
//   // 🌍 שימוש ב-Environment Variables
//   const apiUrl = import.meta.env.VITE_API_URL || 'product-pick-server.onrender.com';
  
//   const handleGoogleAuth = () => {
//     window.location.href = `${apiUrl}/user/google`;
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleGoogleAuth}
//       className="w-full flex justify-center items-center gap-3 px-6 py-3.5
//                border-2 border-gray-200 rounded-xl shadow-sm
//                text-gray-700 font-medium bg-white
//                hover:bg-gray-50 transition-all duration-200
//                hover:shadow-md transform hover:-translate-y-0.5"
//     >
//       <img
//         className="h-6 w-6"
//         src="https://www.svgrepo.com/show/475656/google-color.svg"
//         alt="Google logo"
//       />
//       <span>המשך עם Google</span>
//     </button>
//   );
// };

// export default GoogleAuthButton;
// src/components/auth/GoogleAuthButton.jsx
import React from 'react';

const GoogleAuthButton = () => {
  // 🔧 קבלת משתני הסביבה עם fallback ופרוטוקול
  let apiUrl = import.meta.env.VITE_API_URL || 'https://product-pick-server.onrender.com';
  
  // 🛡️ וודא שיש פרוטוקול (למקרה שמשתנה הסביבה לא כולל אותו)
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `https://${apiUrl}`;
  }

  // 🔍 Debug logging לבדיקה
  console.log('🔍 GoogleAuth Debug:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('Final URL:', apiUrl);
  
  const handleGoogleAuth = () => {
    const fullUrl = `${apiUrl}/user/google`;
    console.log('🚀 Redirecting to:', fullUrl);
    
    // 🛡️ בדיקה לפני redirect
    if (fullUrl.includes('undefined') || !fullUrl.startsWith('http')) {
      console.error('❌ Invalid URL:', fullUrl);
      alert('שגיאה בהגדרת הסביבה');
      return;
    }
    
    window.location.href = fullUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full flex justify-center items-center gap-3 px-6 py-3.5
               border-2 border-gray-200 rounded-xl shadow-sm
               text-gray-700 font-medium bg-white
               hover:bg-gray-50 transition-all duration-200
               hover:shadow-md transform hover:-translate-y-0.5"
    >
      <img
        className="h-6 w-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google logo"
      />
      <span>המשך עם Google</span>
    </button>
  );
};

export default GoogleAuthButton;