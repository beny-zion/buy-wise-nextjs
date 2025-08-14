'use client';

// components/layout/Layout.jsx - ניווט מלא
import React from 'react';
import Link from 'next/link';
import SearchPanel from '@/components/search/SearchPanel';
import ProfileCircle from '@/components/navigation/ProfileCircle';
import { Home, Package, Heart, User } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Profile Circle - Right */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full relative">
                    <ProfileCircle isNavbar={true} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Panel - Center */}
            <div className="flex-1 min-w-0 max-w-md mx-auto">
              <SearchPanel />
            </div>
            
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link href="/products" className="flex items-center gap-2">
                <div className="text-2xl">🛒</div>
                <span className="font-bold text-orange-600 hidden sm:block">Buy Wise</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 right-0 left-0 z-40 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            
            {/* בית */}
            <Link href="/products" className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Home size={24} className="text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">בית</span>
            </Link>

            {/* מוצרים */}
            <Link href="/products" className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Package size={24} className="text-orange-600" />
              <span className="text-xs text-orange-600 mt-1 font-medium">מוצרים</span>
            </Link>

            {/* מועדפים */}
            <Link href="/favorites" className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart size={24} className="text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">מועדפים</span>
            </Link>

            {/* פרופיל */}
            <Link href="/profile" className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <User size={24} className="text-gray-600" />
              <span className="text-xs text-gray-600 mt-1">פרופיל</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile Circle - Bottom Left (Original position for desktop) */}
      <div className="hidden lg:block">
        <ProfileCircle isNavbar={false} />
      </div>
    </div>
  );
};

export default Layout;