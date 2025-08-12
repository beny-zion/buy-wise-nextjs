/* needed */
// hooks/useComments.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { commentService } from '../services/api/comments';

export const useComments = (productId) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalComments: 0,
    questions: 0,
    opinions: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  // טעינת תגובות
  const loadComments = useCallback(async (page = 1, sort = 'newest', append = false) => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await commentService.getProductComments(productId, { page, sort });
      
      if (append) {
        setComments(prev => [...prev, ...response.comments]);
      } else {
        setComments(response.comments);
      }
      
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || 'שגיאה בטעינת התגובות');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // טעינת סטטיסטיקות
  const loadStats = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await commentService.getCommentStats(productId);
      setStats(response.stats);
    } catch (err) {
      console.error('Error loading comment stats:', err);
    }
  }, [productId]);

  // הוספת תגובה חדשה
  const addComment = useCallback(async (commentData) => {
    if (!user) {
      throw new Error('יש להתחבר כדי להגיב');
    }

    try {
      const response = await commentService.createComment({
        productId,
        ...commentData
      });

      // הוספת התגובה החדשה לתחילת הרשימה
      if (commentData.parentCommentId) {
        // אם זו תגובה מקוננת, עדכן את התגובה האב
        setComments(prev => prev.map(comment => 
          comment._id === commentData.parentCommentId
            ? {
                ...comment,
                replies: [response.comment, ...(comment.replies || [])],
                replyCount: comment.replyCount + 1
              }
            : comment
        ));
      } else {
        // תגובה ראשית חדשה
        setComments(prev => [response.comment, ...prev]);
      }

      // עדכון סטטיסטיקות
      setStats(prev => ({
        ...prev,
        totalComments: prev.totalComments + 1,
        questions: commentData.commentType === 'QUESTION' 
          ? prev.questions + 1 
          : prev.questions,
        opinions: commentData.commentType === 'OPINION' 
          ? prev.opinions + 1 
          : prev.opinions
      }));

      return response.comment;
    } catch (err) {
      throw err;
    }
  }, [user, productId]);

  // לייק/ביטול לייק
  const toggleLike = useCallback(async (commentId) => {
    if (!user) {
      throw new Error('יש להתחבר כדי לתת לייק');
    }

    try {
      const response = await commentService.toggleCommentLike(commentId);
      
      // עדכון הלייק בתגובה הרלוונטית
      const updateComment = (comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likeCount: response.likeCount,
            isLikedByUser: response.liked
          };
        }
        
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateComment)
          };
        }
        
        return comment;
      };

      setComments(prev => prev.map(updateComment));
      return response;
    } catch (err) {
      throw err;
    }
  }, [user]);

  // עדכון תגובה
  const updateComment = useCallback(async (commentId, content) => {
    if (!user) {
      throw new Error('יש להתחבר כדי לערוך');
    }

    try {
      const response = await commentService.updateComment(commentId, { content });
      
      // עדכון התגובה ברשימה
      const updateInList = (comment) => {
        if (comment._id === commentId) {
          return { ...comment, content, updatedAt: new Date() };
        }
        
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(updateInList)
          };
        }
        
        return comment;
      };

      setComments(prev => prev.map(updateInList));
      return response.comment;
    } catch (err) {
      throw err;
    }
  }, [user]);

  // מחיקת תגובה
  const deleteComment = useCallback(async (commentId, parentCommentId = null) => {
    if (!user) {
      throw new Error('יש להתחבר כדי למחוק');
    }

    try {
      await commentService.deleteComment(commentId);
      
      if (parentCommentId) {
        // מחיקת תגובה מקוננת
        setComments(prev => prev.map(comment => 
          comment._id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.filter(reply => reply._id !== commentId),
                replyCount: Math.max(0, comment.replyCount - 1)
              }
            : comment
        ));
      } else {
        // מחיקת תגובה ראשית
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      }

      // עדכון סטטיסטיקות
      setStats(prev => ({
        ...prev,
        totalComments: Math.max(0, prev.totalComments - 1)
      }));
    } catch (err) {
      throw err;
    }
  }, [user]);

  // טעינת תגובות מקוננות נוספות
  const loadMoreReplies = useCallback(async (commentId, page = 1) => {
    try {
      const response = await commentService.getCommentReplies(commentId, { page });
      
      setComments(prev => prev.map(comment => 
        comment._id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                ...response.replies
              ],
              hasMoreReplies: response.pagination.hasMore
            }
          : comment
      ));
      
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  // טעינה ראשונית
  useEffect(() => {
    if (productId) {
      loadComments();
      loadStats();
    }
  }, [productId, loadComments, loadStats]);

  return {
    comments,
    loading,
    error,
    stats,
    pagination,
    loadComments,
    addComment,
    toggleLike,
    updateComment,
    deleteComment,
    loadMoreReplies
  };
};
