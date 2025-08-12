/* needed */
// src/components/vendor/questions/QuestionItem.jsx
import React, { useState } from 'react';
import { HelpCircle, Clock, Package, Reply } from 'lucide-react';
import { formatTimeAgo } from '../../../utils/formatters';
import VendorReplyForm from './VendorReplyForm';

const QuestionItem = ({ question, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async (content) => {
    setIsReplying(true);
    try {
      await onReply(question._id, content);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
      <div className="p-6" dir="rtl">
        {/* כותרת השאלה */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={question.userId.profileImage || '/default-avatar.png'}
                  alt={question.userId.fullName}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium text-gray-900">
                  {question.userId.fullName}
                </span>
                <span className="text-sm text-gray-500">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatTimeAgo(question.createdAt)}
                </span>
              </div>
              
              {/* פרטי המוצר */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>על המוצר: {question.productId.title}</span>
              </div>
            </div>
          </div>

          {/* סטטוס */}
          {question.hasVendorReply ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
              נענתה
            </span>
          ) : (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
              ממתינה למענה
            </span>
          )}
        </div>

        {/* תוכן השאלה */}
        <div className="mb-4 pr-10">
          <p className="text-gray-800 leading-relaxed">{question.content}</p>
        </div>

        {/* התשובה אם קיימת */}
        {question.vendorReply && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 mr-10">
            <div className="flex items-center gap-2 mb-2">
              <Reply className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">התשובה שלך:</span>
            </div>
            <p className="text-gray-700">{question.vendorReply.content}</p>
          </div>
        )}

        {/* כפתור תשובה */}
        {!question.hasVendorReply && !showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center gap-2 bg-[#FFA066] text-white px-4 py-2 rounded-lg
                     font-medium hover:bg-[#FF8C3D] transition-colors"
          >
            <Reply className="w-4 h-4" />
            <span>ענה על השאלה</span>
          </button>
        )}

        {/* טופס תשובה */}
        {showReplyForm && (
          <VendorReplyForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            isSubmitting={isReplying}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionItem;