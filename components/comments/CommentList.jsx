/* needed */
// components/comments/CommentList.jsx
import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({
  comments,
  loading,
  filterBy = 'all',
  currentUser,
  onToggleLike,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
  onLoadMoreReplies
}) => {
  // סינון תגובות לפי הסוג
  const filteredComments = comments.filter(comment => {
    switch (filterBy) {
      case 'questions':
        return comment.commentType === 'QUESTION';
      case 'opinions':
        return comment.commentType === 'OPINION';
      case 'all':
      default:
        return true;
    }
  });

  if (loading && comments.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFA066] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">טוען תגובות...</p>
      </div>
    );
  }

  if (filteredComments.length === 0 && filterBy !== 'all') {
    const filterLabels = {
      questions: 'שאלות',
      opinions: 'חוות דעת'
    };

    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">
          אין {filterLabels[filterBy]} עדיין
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {filteredComments.map(comment => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={currentUser}
          onToggleLike={onToggleLike}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
          onAddReply={onAddReply}
          onLoadMoreReplies={onLoadMoreReplies}
        />
      ))}
    </div>
  );
};

export default CommentList;