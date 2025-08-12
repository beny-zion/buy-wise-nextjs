/* needed */
// components/common/SearchConnector.jsx - FIXED VERSION (ללא useEffect מיותר)
import { useEffect, useRef } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { useProductViewer } from '../../contexts/ProductViewerContext';

/**
 * 🔗 קומפוננטה שמחברת בין SearchContext ל-ProductViewerContext
 * עם רישום callbacks ללא תלות מעגלית
 */
const SearchConnector = () => {
  const searchContext = useSearch();
  const { registerSearchContext } = useProductViewer();
  
  // רישום ה-SearchContext ב-ProductViewer (רק פעם אחת)
  const isRegistered = useRef(false);
  
  useEffect(() => {
    if (!isRegistered.current && searchContext && registerSearchContext) {
      console.log('🔗 SearchConnector: רושם SearchContext ב-ProductViewer');
      registerSearchContext(searchContext);
      isRegistered.current = true;
    }
  }, [searchContext, registerSearchContext]);
  
  // 🔧 הסרת debug logging שגורם לרנדרים מיותרים
  // במקום זה, נדפיס רק פעם אחת כשהרישום מושלם
  useEffect(() => {
    if (isRegistered.current && process.env.NODE_ENV === 'development') {
      console.log('✅ SearchConnector: רישום הושלם בהצלחה');
    }
  }, []);
  
  return null; // קומפוננטה לוגית בלבד
};

export default SearchConnector;
// // components/common/SearchConnector.jsx - גרסה מעודכנת
// import { useEffect, useRef } from 'react';
// import { useSearch } from '../../contexts/SearchContext';
// import { useProductViewer } from '../../contexts/ProductViewerContext';

// /**
//  * 🔗 קומפוננטה שמחברת בין SearchContext ל-ProductViewerContext
//  * מרשמת את SearchContext ב-ProductViewer
//  */
// const SearchConnector = () => {
//   const search = useSearch();
//   const { registerSearchContext } = useProductViewer();
  
//   // רישום ה-SearchContext ב-ProductViewer (רק פעם אחת)
//   const isRegistered = useRef(false);
  
//   useEffect(() => {
//     if (!isRegistered.current && search && registerSearchContext) {
//       console.log('🔗 SearchConnector: רושם SearchContext ב-ProductViewer');
//       registerSearchContext(search);
//       isRegistered.current = true;
//     }
//   }, [search, registerSearchContext]);
  
//   // הדפסה רק פעם אחת כשהרישום מושלם
//   useEffect(() => {
//     if (isRegistered.current && process.env.NODE_ENV === 'development') {
//       console.log('✅ SearchConnector: רישום הושלם בהצלחה');
//     }
//   }, []);
  
//   return null; // קומפוננטה לוגית בלבד
// };

// export default SearchConnector;