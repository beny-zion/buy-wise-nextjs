/* needed */
// components/comments/CommentStats.jsx
import React from 'react';
import { MessageCircle, HelpCircle, Star, Heart } from 'lucide-react';

const CommentStats = ({ stats }) => {
  const statItems = [
    {
      icon: MessageCircle,
      label: 'סה"כ תגובות',
      value: stats.totalComments || 0,
      color: 'text-blue-600'
    },
    {
      icon: HelpCircle,
      label: 'שאלות',
      value: stats.questions || 0,
      color: 'text-purple-600'
    },
    {
      icon: Star,
      label: 'חוות דעת',
      value: stats.opinions || 0,
      color: 'text-green-600'
    },
    {
      icon: Heart,
      label: 'לייקים',
      value: stats.totalLikes || 0,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="p-4 bg-gray-50 border-b border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-3 text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2`}>
              <item.icon size={20} className={item.color} />
            </div>
            <div className="text-lg font-bold text-gray-900">{item.value}</div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentStats;