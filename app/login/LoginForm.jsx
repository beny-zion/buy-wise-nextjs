'use client';

// app/login/LoginForm.jsx - טופס התחברות
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const LoginForm = () => {
  const { login, mockLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // איפוס שגיאה כשהמשתמש מתחיל להקליד
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (!result.success) {
        setError(result.error || 'שגיאה בהתחברות');
      }
      // אם ההתחברות הצליחה, הניווט יקרה אוטומטית בקונטקסט
    } catch (error) {
      setError('שגיאה בהתחברות. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = () => {
    mockLogin();
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Demo Login */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800 mb-3">
          <strong>התחברות לדוגמה:</strong> לחץ על הכפתור למטה להתחברות מהירה
        </div>
        <button
          onClick={handleMockLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogIn size={16} />
          התחברות לדוגמה
        </button>
      </div>

      {/* Regular Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            כתובת אימייל
          </label>
          <div className="relative">
            <Mail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="example@domain.com"
              dir="ltr"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            סיסמה
          </label>
          <div className="relative">
            <Lock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pr-12 pl-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="mr-2 text-sm text-gray-600">זכור אותי</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            שכחת סיסמה?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              מתחבר...
            </>
          ) : (
            <>
              <LogIn size={16} />
              התחברות
            </>
          )}
        </button>
      </form>

      {/* Social Login Options */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">או התחבר עם</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">🇬</span>
          Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;