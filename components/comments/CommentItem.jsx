/* needed */
// components/comments/CommentItem.jsx
import React, { useState } from 'react';
import { Heart, Reply, Edit2, Trash2, MoreVertical, Quote, MessageCircle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/formatters';
import CommentForm from './CommentForm';

const CommentTypeBadge = ({ type }) => {
  const config = {
    QUESTION: { 
      color: 'bg-blue-100 text-blue-700', 
      icon: '?', 
      label: 'שאלה' 
    },
    OPINION: { 
      color: 'bg-green-100 text-green-700', 
      icon: '★', 
      label: 'חוות דעת' 
    },
    GENERAL: null
  };

  const badgeConfig = config[type];
  if (!badgeConfig) return null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeConfig.color}`}>
      <span>{badgeConfig.icon}</span>
      <span>{badgeConfig.label}</span>
    </span>
  );
};

const QuotedComment = ({ quotedComment }) => {
  if (!quotedComment) return null;

  return (
    <div className="bg-gray-50 border-r-4 border-gray-300 p-3 mb-3 rounded">
      <div className="flex items-center gap-2 mb-1">
        <Quote size={14} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-600">
          {quotedComment.userName}
        </span>
      </div>
      <p className="text-sm text-gray-700 line-clamp-2">
        {quotedComment.content}
      </p>
    </div>
  );
};

const CommentItem = ({
  comment,
  currentUser,
  depth = 0,
  onToggleLike,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
  onLoadMoreReplies,
  onQuote
}) => {
  const [isLiked, setIsLiked] = useState(comment.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [showReplies, setShowReplies] = useState(depth === 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = currentUser?._id === comment.userId._id;
  const maxDepth = 3; // מגביל את עומק התגובות המקוננות

  const handleLike = async () => {
    try {
      const result = await onToggleLike(comment._id);
      setIsLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReply = async (replyData) => {
    try {
      await onAddReply({
        ...replyData,
        parentCommentId: comment._id
      });
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  const handleQuote = () => {
    if (onQuote) {
      onQuote({
        commentId: comment._id,
        content: comment.content,
        userName: comment.userId.fullName
      });
    }
  };

  const handleEdit = async (content) => {
    try {
      await onUpdateComment(comment._id, content);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) {
      try {
        await onDeleteComment(comment._id, comment.parentCommentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className={`${depth > 0 ? 'mr-8 mt-4' : ''}`}>
      <div className="bg-white hover:bg-gray-50 transition-colors">
        <div className="flex gap-3 p-4">
          {/* תמונת פרופיל */}
          <img
            src={comment.userId.profileImage || '/default-avatar.png'}
            alt={comment.userId.fullName}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />

          <div className="flex-grow min-w-0">
            {/* כותרת התגובה */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {comment.userId.fullName}
                </span>
                <CommentTypeBadge type={comment.commentType} />
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(comment.createdAt)}
                </span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400">(נערך)</span>
                )}
              </div>

              {/* תפריט פעולות */}
              {(isOwner || currentUser) && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {showMenu && (
                    <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          handleQuote();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Quote size={14} />
                        ציטוט
                      </button>
                      
                      {isOwner && (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit2 size={14} />
                            עריכה
                          </button>
                          <button
                            onClick={() => {
                              handleDelete();
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 size={14} />
                            מחיקה
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ציטוט */}
            <QuotedComment quotedComment={comment.quotedComment} />

            {/* תוכן התגובה */}
            {isEditing ? (
              <CommentForm
                initialContent={comment.content}
                onSubmit={({ content }) => handleEdit(content)}
                onCancel={() => setIsEditing(false)}
                isEditing
                placeholder="ערוך את התגובה..."
              />
            ) : (
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}

            {/* כפתורי פעולה */}
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{likeCount}</span>
              </button>

              {depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#FFA066] transition-colors"
                >
                  <Reply size={16} />
                  <span>הגב</span>
                </button>
              )}

              {comment.replyCount > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#FFA066] transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>
                    {showReplies ? 'הסתר' : 'הצג'} תגובות ({comment.replyCount})
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* טופס תגובה */}
        {showReplyForm && (
          <div className="px-4 pb-4 mr-13">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`הגב ל${comment.userId.fullName}...`}
            />
          </div>
        )}

        {/* תגובות מקוננות */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="border-r border-gray-200 mr-6">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                currentUser={currentUser}
                depth={depth + 1}
                onToggleLike={onToggleLike}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onAddReply={onAddReply}
                onQuote={onQuote}
              />
            ))}

            {/* כפתור טעינת עוד תגובות */}
            {comment.hasMoreReplies && (
              <div className="p-4 mr-6">
                <button
                  onClick={() => onLoadMoreReplies(comment._id)}
                  className="text-[#FFA066] hover:text-[#FF8C3D] text-sm font-medium"
                >
                  טען עוד תגובות...
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
