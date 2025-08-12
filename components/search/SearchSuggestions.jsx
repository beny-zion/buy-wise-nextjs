// /* needed */
// // components/search/SearchSuggestions.jsx - UPDATED VERSION (With vendor selection)
// import React from 'react';
// import { Search, User, Package, TrendingUp } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useSearch } from '../../contexts/SearchContext';

// const SearchSuggestions = () => {
//   const { suggestions, searchQuery, selectSuggestion } = useSearch();
//   console.log('Suggestions:', suggestions, 'Search Query:', searchQuery);
//   if (!suggestions || suggestions.length === 0) {
//     return null;
//   }
  
//   const getIcon = (type) => {
//     switch (type) {
//       case 'product':
//         return <Package className="w-4 h-4" />;
//       case 'vendor':
//         return <User className="w-4 h-4" />;
//       case 'search':
//       default:
//         return <Search className="w-4 h-4" />;
//     }
//   };
  
//   const highlightMatch = (text, query) => {
//     if (!query) return text;
    
//     const regex = new RegExp(`(${query})`, 'gi');
//     const parts = text.split(regex);
    
//     return parts.map((part, index) => 
//       regex.test(part) ? (
//         <span key={index} className="font-medium text-[#FFA066]">{part}</span>
//       ) : (
//         <span key={index}>{part}</span>
//       )
//     );
//   };
  
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       transition={{ duration: 0.2 }}
//       className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 
//                  overflow-hidden z-50 max-h-80 overflow-y-auto"
//     >
//       {suggestions.map((suggestion, index) => (
//         <button
//           key={index}
//           onClick={() => selectSuggestion(suggestion)}
//           className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors
//                      text-right border-b border-gray-50 last:border-0 relative overflow-hidden
//                      group"
//           dir="rtl"
//         >
//           {/* Background effect */}
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 
//                         opacity-0 group-hover:opacity-100 transition-opacity" />
          
//           {/* Icon */}
//           <div className={`p-2 rounded-lg relative z-10 ${
//             suggestion.type === 'vendor' ? 'bg-blue-50 text-blue-600' :
//             suggestion.type === 'product' ? 'bg-green-50 text-green-600' :
//             'bg-gray-100 text-gray-600'
//           }`}>
//             {getIcon(suggestion.type)}
//           </div>
          
//           {/* Vendor image for vendor suggestions */}
//           {suggestion.type === 'vendor' && suggestion.image && (
//             <img
//               src={suggestion.image}
//               alt={suggestion.text}
//               className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-md relative z-10"
//             />
//           )}
          
//           {/* Content */}
//           <div className="flex-1 text-right relative z-10">
//             <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
//               {highlightMatch(suggestion.text, searchQuery)}
//               {suggestion.highlight && (
//                 <TrendingUp className="w-3 h-3 text-[#FFA066]" />
//               )}
//             </div>
            
//             {/* Additional Info */}
//             {suggestion.category && (
//               <div className="text-xs text-gray-500 mt-0.5">
//                 בקטגוריית {suggestion.category}
//               </div>
//             )}
            
//             {/* Vendor specific info */}
//             {suggestion.type === 'vendor' && (
//               <div className="text-xs text-gray-500 mt-0.5">
//                 מוכר פעיל במערכת
//               </div>
//             )}
//           </div>
          
//           {/* Type Label */}
//           <div className={`text-xs px-2 py-1 rounded-full font-medium relative z-10 ${
//             suggestion.type === 'vendor' ? 'bg-blue-100 text-blue-700' :
//             suggestion.type === 'product' ? 'bg-green-100 text-green-700' :
//             'bg-gray-100 text-gray-700'
//           }`}>
//             {suggestion.type === 'vendor' ? 'מוכר' :
//              suggestion.type === 'product' ? 'מוצר' :
//              'חיפוש'}
//           </div>
//         </button>
//       ))}
//     </motion.div>
//   );
// };

// export default SearchSuggestions;
/* needed */
// components/search/SearchSuggestions.jsx - ULTRA RESPONSIVE VERSION
import React from 'react';
import { Search, User, Package, TrendingUp, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearch } from '../../contexts/SearchContext';

const SearchSuggestions = () => {
  const { suggestions, searchQuery, selectSuggestion } = useSearch();
  
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  const getIcon = (type) => {
    switch (type) {
      case 'product':
        return <Package className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'vendor':
        return <User className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'category':
        return <Tag className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'search':
      default:
        return <Search className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };
  
  // קיצור אגרסיבי למובייל
  const truncateText = (text, mobile = 25, desktop = 50) => {
    if (!text) return text;
    return text.length <= mobile ? text : text.substring(0, mobile) + '...';
  };
  
  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-[#FFA066] bg-orange-50/80 px-0.5 py-0.5 rounded-sm text-xs sm:text-sm">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };
  
  const getTypeConfig = (type) => {
    switch (type) {
      case 'vendor':
        return {
          bgColor: 'bg-blue-50/90 text-blue-600 border-blue-100/60',
          labelBg: 'bg-blue-500/90 text-white',
          label: 'מוכר',
          emoji: '👤'
        };
      case 'product':
        return {
          bgColor: 'bg-emerald-50/90 text-emerald-600 border-emerald-100/60',
          labelBg: 'bg-emerald-500/90 text-white',
          label: 'מוצר',
          emoji: '📦'
        };
      case 'category':
        return {
          bgColor: 'bg-purple-50/90 text-purple-600 border-purple-100/60',
          labelBg: 'bg-purple-500/90 text-white',
          label: 'קטגוריה',
          emoji: '🏷️'
        };
      default:
        return {
          bgColor: 'bg-gray-50/90 text-gray-600 border-gray-100/60',
          labelBg: 'bg-gray-500/90 text-white',
          label: 'חיפוש',
          emoji: '🔍'
        };
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-white/98 backdrop-blur-md 
                 rounded-lg sm:rounded-2xl shadow-2xl shadow-black/25 border border-gray-200/80 
                 overflow-hidden z-50 max-h-72 sm:max-h-96 overflow-y-auto scrollbar-hide"
    >
      <div className="p-1 sm:p-2 space-y-0.5 sm:space-y-1">
        {suggestions.map((suggestion, index) => {
          const typeConfig = getTypeConfig(suggestion.type);
          const truncatedText = truncateText(suggestion.text);
          
          return (
            <motion.button
              key={`${suggestion.type}-${suggestion._id || suggestion.id || index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.015, duration: 0.15 }}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3 hover:bg-gray-50/90 
                         active:bg-gray-100/90 transition-all duration-150 text-right rounded-lg sm:rounded-xl 
                         relative overflow-hidden group border border-transparent hover:border-gray-200/60 
                         hover:shadow-sm min-h-[44px] sm:min-h-[60px] backdrop-blur-sm"
              dir="rtl"
            >
              {/* Background effect - יותר אטום */}
              <div className="absolute inset-0 bg-gradient-to-l from-gray-50/95 to-gray-100/95 
                            opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg sm:rounded-xl" />
              
              {/* Mobile: Type emoji + Icon, Desktop: Full layout */}
              <div className="flex-shrink-0 relative z-10">
                {/* Mobile version */}
                <div className="block sm:hidden">
                  <div className={`px-1.5 py-1 rounded-md text-xs font-bold ${typeConfig.labelBg} shadow-sm`}>
                    {typeConfig.emoji}
                  </div>
                </div>
                
                {/* Desktop version */}
                <div className="hidden sm:flex sm:flex-col sm:items-center sm:gap-1">
                  <div className={`p-2 rounded-xl border ${typeConfig.bgColor} shadow-sm 
                                 group-hover:shadow-md transition-all duration-200`}>
                    {getIcon(suggestion.type)}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeConfig.labelBg} 
                                 opacity-90 group-hover:opacity-100 transition-opacity`}>
                    {typeConfig.label}
                  </div>
                </div>
              </div>
              
              {/* Vendor image - קטן יותר במובייל */}
              {suggestion.type === 'vendor' && suggestion.image && (
                <div className="flex-shrink-0 relative z-10">
                  <img
                    src={suggestion.image}
                    alt={suggestion.text}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-white 
                             shadow-sm group-hover:shadow-md transition-all duration-200"
                  />
                </div>
              )}
              
              {/* Content section - מותאם למובייל */}
              <div className="flex-1 min-w-0 text-right relative z-10">
                {/* Main text */}
                <div className="text-xs sm:text-sm font-medium text-gray-900 mb-0.5 sm:mb-1 leading-tight">
                  <div className="break-words line-clamp-1 sm:line-clamp-2">
                    {highlightMatch(truncatedText, searchQuery)}
                  </div>
                  {suggestion.highlight && (
                    <TrendingUp className="inline-block w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FFA066] mr-1 mb-0.5" />
                  )}
                </div>
                
                {/* Additional info - רק בדסקטופ או מידע חשוב */}
                <div className="hidden sm:flex sm:items-center sm:justify-end sm:gap-2 text-xs text-gray-500">
                  {suggestion.category && (
                    <span className="bg-gray-100/80 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                      {suggestion.category}
                    </span>
                  )}
                  
                  {suggestion.type === 'vendor' && (
                    <span className="text-blue-600 font-medium text-xs">
                      מוכר פעיל
                    </span>
                  )}
                </div>
                
                {/* Mobile - רק אינפו בסיסי */}
                <div className="block sm:hidden">
                  {suggestion.category && (
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.category}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile type label */}
              <div className="block sm:hidden flex-shrink-0 relative z-10">
                <div className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${typeConfig.labelBg} 
                               opacity-80 group-hover:opacity-100 transition-opacity`}>
                  {typeConfig.label}
                </div>
              </div>
              
              {/* Desktop arrow indicator */}
              <div className="hidden sm:block flex-shrink-0 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
                               flex items-center justify-center shadow-sm">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Footer hint - רק בדסקטופ */}
      {suggestions.length > 3 && (
        <div className="hidden sm:block p-2 sm:p-3 border-t border-gray-100/80 bg-gray-50/80 backdrop-blur-sm">
          <div className="text-center text-xs text-gray-500">
            הקלד Enter לחיפוש מהיר או בחר הצעה מהרשימה
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SearchSuggestions;