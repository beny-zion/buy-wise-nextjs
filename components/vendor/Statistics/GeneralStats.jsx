/* needed */
// components/vendor/Statistics/GeneralStats.jsx - עדכון לאנליטיקה פשוטה
import React, { useState, useEffect } from 'react';
import { vendorService } from '../../../services/api/vendor';
import { Monitor, MousePointer, TrendingUp, Package } from 'lucide-react';

const GeneralStats = ({ className = '' }) => {
  const [stats, setStats] = useState({
    totalModalOpens: 0,
    totalClicks: 0,
    averageConversionRate: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await vendorService.getStats();
        
        // אם יש נתונים תקינים, שמור אותם
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Error loading stats:', err);
        setError('שגיאה בטעינת הסטטיסטיקות');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg 
                   transition-all duration-200 border border-gray-100">
      <div className="flex items-center gap-4" dir="rtl">
        <div className="p-3 bg-gradient-to-br from-[#FFA066]/10 to-[#FF6B6B]/10 
                      text-[#FFA066] rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] 
                         bg-clip-text text-transparent">
            {value}
          </div>
          <div className="text-gray-600 text-sm font-medium">{label}</div>
        </div>
      </div>
    </div>
  );

  // עיבוד ערכים להצגה
  const displayStats = {
    totalModalOpens: loading ? '-' : stats.totalModalOpens?.toLocaleString() || 0,
    totalClicks: loading ? '-' : stats.totalClicks?.toLocaleString() || 0,
    averageConversionRate: loading ? '-' : `${(stats.averageConversionRate || 0).toFixed(1)}%`,
    totalProducts: loading ? '-' : stats.totalProducts?.toLocaleString() || 0
  };

  return (
    <div className={className}>
      {/* כרטיסי סטטיסטיקה */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Monitor}
          label="פתיחות מודל"
          value={displayStats.totalModalOpens}
        />
        <StatCard
          icon={MousePointer}
          label="קליקים"
          value={displayStats.totalClicks}
        />
        <StatCard
          icon={TrendingUp}
          label="אחוז המרה ממוצע"
          value={displayStats.averageConversionRate}
        />
        <StatCard
          icon={Package}
          label="סה״כ מוצרים"
          value={displayStats.totalProducts}
        />
      </div>
      
      {/* הודעת שגיאה */}
      {error && (
        <div className="mt-4 text-center text-red-500 bg-red-50 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default GeneralStats;