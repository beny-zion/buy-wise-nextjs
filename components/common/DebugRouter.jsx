/* needed */
// components/common/DebugRouter.jsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const DebugRouter = () => {
  const location = useLocation();
  const params = useParams();
  const lastPathname = useRef('');
  
  useEffect(() => {
    // הדפס debug רק כשיש שינוי אמיתי במסלול
    if (process.env.NODE_ENV === 'development' && 
        location.pathname !== lastPathname.current) {
      
      console.log('🔍 Router Debug Info:', {
        pathname: location.pathname,
        search: location.search,
        params: params,
        timestamp: new Date().toLocaleTimeString()
      });
      
      lastPathname.current = location.pathname;
    }
  }, [location.pathname, location.search, params]);
  
  return null; // קומפוננטה לוגית בלבד
};

export default DebugRouter;