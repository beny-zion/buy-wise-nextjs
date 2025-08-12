/* needed */
// components/comments/CommentSection.jsx
import React, { useState } from 'react';
import { MessageCircle, TrendingUp, HelpCircle, Filter } from 'lucide-react';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import CommentStats from './CommentStats';

const CommentSection = ({ productId, isVisible }) => {
  const { user } = useAuth();
  const {
    comments,
    loading,
    stats,
    pagination,
    loadComments,
    addComment,
    toggleLike,
    updateComment,
    deleteComment,
    loadMoreReplies
  } = useComments(productId);

  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showCommentForm, setShowCommentForm] = useState(false);

  if (!isVisible) return null;

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    loadComments(1, newSort);
  };

  const handleAddComment = async (commentData) => {
    try {
      await addComment(commentData);
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      loadComments(pagination.currentPage + 1, sortBy, true);
    }
  };

  return (
    <div className="bg-white" dir="rtl">
      {/* סטטיסטיקות */}
      <CommentStats stats={stats} />

      {/* כותרת ופילטרים */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            שאלות ותגובות ({stats.totalComments})
          </h3>
          
          {/* כפתור הוספת תגובה */}
          {user && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="flex items-center gap-2 bg-[#FFA066] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF8C3D] transition-colors"
            >
              <MessageCircle size={16} />
              <span>הוסף תגובה</span>
            </button>
          )}
        </div>

        {/* פילטרים ומיון */}
        <div className="flex items-center gap-4">
          {/* מיון */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#FFA066] focus:border-transparent"
            >
              <option value="newest">החדשות ביותר</option>
              <option value="oldest">הישנות ביותר</option>
              <option value="popular">הפופולריות ביותר</option>
              <option value="mostLiked">הכי הרבה לייקים</option>
            </select>
          </div>

          {/* סינון לפי סוג */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterBy === 'all'
                  ? 'bg-[#FFA066] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              הכל
            </button>
            <button
              onClick={() => setFilterBy('questions')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterBy === 'questions'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HelpCircle size={14} />
              <span>שאלות</span>
            </button>
            <button
              onClick={() => setFilterBy('opinions')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterBy === 'opinions'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={14} />
              <span>חוות דעת</span>
            </button>
          </div>
        </div>
      </div>

      {/* טופס הוספת תגובה */}
      {showCommentForm && (
        <div className="border-b border-gray-100">
          <CommentForm
            onSubmit={handleAddComment}
            onCancel={() => setShowCommentForm(false)}
            placeholder="שתף את השאלה או דעתך על המוצר..."
          />
        </div>
      )}

      {/* רשימת תגובות */}
      <CommentList
        comments={comments}
        loading={loading}
        filterBy={filterBy}
        onToggleLike={toggleLike}
        onUpdateComment={updateComment}
        onDeleteComment={deleteComment}
        onAddReply={addComment}
        onLoadMoreReplies={loadMoreReplies}
        currentUser={user}
      />

      {/* כפתור טעינת עוד */}
      {pagination.hasMore && (
        <div className="p-4 text-center border-t border-gray-100">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="text-[#FFA066] hover:text-[#FF8C3D] font-medium disabled:opacity-50"
          >
            {loading ? 'טוען...' : `טען עוד תגובות (${comments.length}/${stats.totalComments})`}
          </button>
        </div>
      )}

      {/* הודעה כשאין תגובות */}
      {!loading && comments.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium mb-2">אין תגובות עדיין</h4>
          <p className="text-sm mb-4">היה הראשון לשאול שאלה או לחלוק את דעתך על המוצר</p>
          {user && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="bg-[#FFA066] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#FF8C3D] transition-colors"
            >
              הוסף תגובה ראשונה
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;