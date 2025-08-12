/* needed */
// src/components/vendor/questions/VendorReplyForm.jsx
import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

const VendorReplyForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4" dir="rtl">
      <div className="space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="כתוב את התשובה שלך..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-[#FFA066] focus:border-transparent
                   resize-none"
          rows={4}
          required
          disabled={isSubmitting}
        />
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 inline mr-1" />
            ביטול
          </button>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center gap-2 bg-[#FFA066] text-white px-6 py-2 
                     rounded-lg font-medium hover:bg-[#FF8C3D] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'שולח...' : 'שלח תשובה'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default VendorReplyForm;