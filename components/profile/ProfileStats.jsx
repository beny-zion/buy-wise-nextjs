/* needed */
// src/components/profile/ProfileStats.jsx
import React from 'react';
import { Calendar, ShoppingBag, User, TrendingUp } from 'lucide-react';

const ProfileStats = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccountTypeText = () => {
    if (user.isVendor) {
      return {
        text: 'מוכר מוסמך',
        icon: TrendingUp,
        color: 'text-[#FFA066]'
      };
    }
    return {
      text: 'משתמש רגיל',
      icon: User,
      color: 'text-gray-600'
    };
  };

  const accountType = getAccountTypeText();
  const AccountIcon = accountType.icon;

  const stats = [
    {
      icon: ShoppingBag,
      label: 'מוצרים פעילים',
      value: user.isVendor ? user.productsLimit || '0' : '-',
      color: 'text-[#FFA066]',
      bgColor: 'bg-[#FFA066]/10'
    },
    {
      icon: Calendar,
      label: 'הצטרף בתאריך',
      value: formatDate(user.createdAt),
      color: 'text-[#FF6B6B]',
      bgColor: 'bg-[#FF6B6B]/10'
    },
    {
      icon: AccountIcon,
      label: 'סוג חשבון',
      value: accountType.text,
      color: accountType.color,
      bgColor: user.isVendor ? 'bg-[#FFA066]/10' : 'bg-gray-100'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
                        bg-clip-text text-transparent flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA066]" />
            סטטיסטיקות חשבון
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">נתונים כלליים על הפעילות שלך</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/40 
                         hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]
                         text-center group"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 ${stat.bgColor} rounded-full flex items-center justify-center 
                              mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1 sm:mb-2`}>
                  {stat.value}
                </div>
                
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* פרטים נוספים למוכרים */}
        {user.isVendor && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#FFA066]/10 to-[#FF6B6B]/10 
                        rounded-2xl border border-[#FFA066]/20">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">מוכר מוסמך</h3>
              <p className="text-sm text-gray-600">
                אתה מוכר מוסמך ברשת BuyWise! תוכל להוסיף ולנהל מוצרים, לענות על שאלות לקוחות ולעקוב אחר הביצועים שלך.
              </p>
            </div>
          </div>
        )}

        {/* מידע נוסף */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            נתונים עודכנו לאחרונה: {new Date().toLocaleDateString('he-IL')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;