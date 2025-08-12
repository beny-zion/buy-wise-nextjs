/* needed */
// src/components/vendor/questions/QuestionsList.jsx
import React from 'react';
import QuestionItem from './QuestionItem';
import { MessageCircle } from 'lucide-react';

const QuestionsList = ({ questions, loading, onReply }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FFA066] border-t-transparent" />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-12 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">אין שאלות להצגה</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map(question => (
        <QuestionItem
          key={question._id}
          question={question}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default QuestionsList;