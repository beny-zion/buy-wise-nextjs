/* needed */
// components/comments/CommentForm.jsx
import React, { useState } from 'react';
import { Send, HelpCircle, Star, X, Quote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = "כתוב תגובה...",
  initialContent = "",
  isEditing = false,
  quotedComment = null,
  onClearQuote = null
}) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [commentType, setCommentType] = useState('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600 mb-3">יש להתחבר כדי להגיב</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-[#FFA066] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#FF8C3D] transition-colors"
        >
          התחבר
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        content: content.trim(),
        commentType,
        ...(quotedComment && { quotedComment })
      };
      
      await onSubmit(commentData);
      
      if (!isEditing) {
        setContent('');
        setCommentType('GENERAL');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentTypeOptions = [
    { value: 'GENERAL', label: 'תגובה כללית', icon: null },
    { value: 'QUESTION', label: 'שאלה למוכר', icon: <HelpCircle size={16} /> },
    { value: 'OPINION', label: 'חוות דעת', icon: <Star size={16} /> }
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
        {/* אזור משתמש */}
        <div className="flex items-center gap-3">
          <img
            src={user.profileImage || '/default-avatar.png'}
            alt={user.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <span className="font-medium text-gray-900">{user.fullName}</span>
            <div className="text-sm text-gray-500">כותב תגובה...</div>
          </div>
        </div>

        {/* ציטוט */}
        {quotedComment && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Quote size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  בתגובה ל{quotedComment.userName}
                </span>
              </div>
              {onClearQuote && (
                <button
                  type="button"
                  onClick={onClearQuote}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {quotedComment.content}
            </p>
          </div>
        )}

        {/* בורר סוג תגובה */}
        {!isEditing && (
          <div className="flex gap-2">
            {commentTypeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCommentType(option.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  commentType === option.value
                    ? 'bg-[#FFA066] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* תיבת טקסט */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFA066] focus:border-transparent resize-none"
            rows={4}
            maxLength={1000}
            required
          />
          <div className="absolute bottom-2 left-2 text-xs text-gray-400">
            {content.length}/1000
          </div>
        </div>

        {/* הנחיות וטיפים */}
        {commentType === 'QUESTION' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">טיפ לשאלה טובה</span>
            </div>
            <p className="text-sm text-blue-700">
              כתוב שאלה ספציפית וברורה. המוכר יקבל התראה ויענה לשאלתך בהקדם.
            </p>
          </div>
        )}

        {commentType === 'OPINION' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">חוות דעת מועילה</span>
            </div>
            <p className="text-sm text-green-700">
              שתף את החוויה שלך עם המוצר. מה אהבת? מה פחות? זה יעזור לאחרים להחליט.
            </p>
          </div>
        )}

        {/* כפתורי פעולה */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ביטול
          </button>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 bg-[#FFA066] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#FF8C3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            <span>{isSubmitting ? 'שולח...' : isEditing ? 'שמור שינויים' : 'פרסם תגובה'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;