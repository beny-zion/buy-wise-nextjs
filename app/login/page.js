// app/login/page.js - דף התחברות
import LoginForm from './LoginForm';

export const metadata = {
  title: 'התחברות | Buy Wise',
  description: 'התחבר לחשבון שלך ב-Buy Wise',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center py-12 px-4" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ברוכים הבאים ל-Buy Wise
          </h2>
          <p className="text-gray-600">
            התחבר כדי לגלות את המוצרים הטובים ביותר מאלי אקספרס
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>עדיין אין לך חשבון?</p>
          <button className="text-orange-600 hover:text-orange-700 font-medium">
            הרשמה חדשה
          </button>
        </div>
      </div>
    </div>
  );
}