// /* needed */
// // hooks/useFavorites.js
// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { favoritesService } from '../services/api/favorites';

// export const useFavorites = (productId = null) => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [favorites, setFavorites] = useState([]);
//   const [isFavorite, setIsFavorite] = useState(false);

//   // בדיקת סטטוס למוצר ספציפי
//   useEffect(() => {
//     if (productId && user) {
//       const checkStatus = async () => {
//         try {
//           const { isFavorite } = await favoritesService.checkFavoriteStatus(productId);
//           setIsFavorite(isFavorite);
//         } catch (error) {
//           console.error('Error checking favorite status:', error);
//         }
//       };
      
//       checkStatus();
//     }
//   }, [productId, user]);

//   // טעינת כל המוצרים המועדפים
//   const loadFavorites = useCallback(async () => {
//     if (!user) {
//       setFavorites([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const { favorites } = await favoritesService.getFavorites();
//       setFavorites(favorites);
//     } catch (error) {
//       console.error('Error loading favorites:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // הוספת מוצר למועדפים
//   const addToFavorites = useCallback(async (productToAdd) => {
//     if (!user) {
//       return { success: false, message: 'יש להתחבר כדי להוסיף מוצרים למועדפים' };
//     }

//     try {
//       const result = await favoritesService.addFavorite(productToAdd || productId);
      
//       if (result.success) {
//         if (productId === (productToAdd || productId)) {
//           setIsFavorite(true);
//         }
//         // רענון הרשימה אם צריך
//         if (favorites.length > 0) {
//           await loadFavorites();
//         }
//       }
      
//       return result;
//     } catch (error) {
//       console.error('Error adding favorite:', error);
//       return { success: false, message: error.message || 'שגיאה בהוספת מוצר למועדפים' };
//     }
//   }, [user, productId, favorites.length, loadFavorites]);

//   // הסרת מוצר מהמועדפים
//   const removeFromFavorites = useCallback(async (productToRemove) => {
//     if (!user) return { success: false };

//     try {
//       const result = await favoritesService.removeFavorite(productToRemove || productId);
      
//       if (result.success) {
//         if (productId === (productToRemove || productId)) {
//           setIsFavorite(false);
//         }
//         // עדכון אופטימי
//         if (favorites.length > 0) {
//           setFavorites(prev => prev.filter(f => f.product._id !== (productToRemove || productId)));
//         }
//       }
      
//       return result;
//     } catch (error) {
//       console.error('Error removing favorite:', error);
//       return { success: false, message: error.message || 'שגיאה בהסרת מוצר מהמועדפים' };
//     }
//   }, [user, productId, favorites.length]);

//   // החלפת מצב מועדף
//   const toggleFavorite = useCallback(async () => {
//     if (!productId) return;
    
//     if (isFavorite) {
//       return await removeFromFavorites();
//     } else {
//       return await addToFavorites();
//     }
//   }, [productId, isFavorite, addToFavorites, removeFromFavorites]);

//   return {
//     loading,
//     favorites,
//     isFavorite,
//     loadFavorites,
//     addToFavorites,
//     removeFromFavorites,
//     toggleFavorite
//   };
// };
// src/hooks/useFavorites.js - גרסה מאופטמזת עם cache
// src/hooks/useFavorites.js - גרסה פשוטה ובטוחה
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { favoritesService } from '../services/api/favorites';

export const useFavorites = (productId = null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 🎯 טעינת מועדפים פשוטה
  const {
    data: favoritesResponse,
    isLoading: loading,
    refetch: refetchFavorites
  } = useQuery({
    queryKey: ['favorites', user?._id],
    queryFn: async () => {
      if (!user?._id) {
        return { favorites: [] };
      }
      
      try {
        const response = await favoritesService.getFavorites();
        return response || { favorites: [] };
      } catch (error) {
        console.error('❌ שגיאה בטעינת מועדפים:', error);
        return { favorites: [] };
      }
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
    retry: 1
  });
  
  // 🛡️ הגנות על הנתונים
  const favorites = useMemo(() => {
    try {
      if (!favoritesResponse?.favorites) return [];
      if (!Array.isArray(favoritesResponse.favorites)) return [];
      return favoritesResponse.favorites;
    } catch (error) {
      console.error('❌ שגיאה בעיבוד מועדפים:', error);
      return [];
    }
  }, [favoritesResponse]);
  
  // 🔧 יצירת favoriteIds כ-Set - פשוט ובטוח
  const favoriteIds = useMemo(() => {
    try {
      const ids = favorites
        .map(fav => {
          if (fav?.product?._id) return fav.product._id;
          if (fav?._id) return fav._id;
          if (typeof fav === 'string') return fav;
          return null;
        })
        .filter(id => id && typeof id === 'string');
      
      return new Set(ids);
    } catch (error) {
      console.error('❌ שגיאה ביצירת favoriteIds:', error);
      return new Set();
    }
  }, [favorites]);
  
  // עדכון מצב מוצר ספציפי
  useEffect(() => {
    try {
      if (productId && favoriteIds.size > 0) {
        setIsFavorite(favoriteIds.has(productId));
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('❌ שגיאה בעדכון סטטוס:', error);
      setIsFavorite(false);
    }
  }, [productId, favoriteIds]);
  
  // מוטציה הוספה
  const addMutation = useMutation({
    mutationFn: async (productToAdd) => {
      const targetProduct = productToAdd || productId;
      if (!targetProduct) throw new Error('מזהה מוצר חסר');
      return await favoritesService.addFavorite(targetProduct);
    },
    onSuccess: (result, productToAdd) => {
      if (result?.success) {
        const targetProduct = productToAdd || productId;
        queryClient.invalidateQueries(['favorites', user?._id]);
        if (productId === targetProduct) setIsFavorite(true);
      }
    }
  });
  
  // מוטציה הסרה
  const removeMutation = useMutation({
    mutationFn: async (productToRemove) => {
      const targetProduct = productToRemove || productId;
      if (!targetProduct) throw new Error('מזהה מוצר חסר');
      return await favoritesService.removeFavorite(targetProduct);
    },
    onSuccess: (result, productToRemove) => {
      if (result?.success) {
        const targetProduct = productToRemove || productId;
        queryClient.invalidateQueries(['favorites', user?._id]);
        if (productId === targetProduct) setIsFavorite(false);
      }
    }
  });
  
  // 🎯 פונקציות ציבוריות פשוטות
  const loadFavorites = useCallback(() => {
    refetchFavorites();
  }, [refetchFavorites]);
  
  const addToFavorites = useCallback(async (productToAdd) => {
    if (!user) {
      return { success: false, message: 'יש להתחבר כדי להוסיף מוצרים למועדפים' };
    }
    
    try {
      return await addMutation.mutateAsync(productToAdd);
    } catch (error) {
      return { success: false, message: error.message || 'שגיאה בהוספת מוצר למועדפים' };
    }
  }, [user, addMutation]);
  
  const removeFromFavorites = useCallback(async (productToRemove) => {
    if (!user) {
      return { success: false, message: 'יש להתחבר' };
    }
    
    try {
      return await removeMutation.mutateAsync(productToRemove);
    } catch (error) {
      return { success: false, message: error.message || 'שגיאה בהסרת מוצר מהמועדפים' };
    }
  }, [user, removeMutation]);
  
  const toggleFavorite = useCallback(async (productToToggle = null) => {
    const targetProduct = productToToggle || productId;
    if (!targetProduct) {
      return { success: false, message: 'מזהה מוצר חסר' };
    }
    
    const isCurrentlyFavorite = favoriteIds.has(targetProduct);
    
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(targetProduct);
    } else {
      return await addToFavorites(targetProduct);
    }
  }, [favoriteIds, productId, addToFavorites, removeFromFavorites]);
  
  // ניקוי cache בlogout
  useEffect(() => {
    if (!user && queryClient) {
      queryClient.removeQueries(['favorites']);
    }
  }, [user, queryClient]);
  
  return {
    favorites: favorites || [],
    favoriteIds: favoriteIds || new Set(),
    loading: loading || false,
    isFavorite: isFavorite || false,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isAddingFavorite: addMutation.isLoading || false,
    isRemovingFavorite: removeMutation.isLoading || false
  };
};