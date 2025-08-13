'use client';

import React from 'react';
import { Outlet } from 'react-router-dom';
import SearchPanel from '../search/SearchPanel';
import SearchResults from '../search/SearchResults';
import ProfileCircle from '../home/navigation/ProfileCircle';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 right-0 left-0 z-40">
        <div className="bg-white/98 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-200/50">
          <div className="max-w-[550px] mx-auto px-5 py-3.5">
            <div className="flex items-center gap-4">
              {/* Profile Circle - Right */}
              <div className="flex-shrink-0 relative">
                <div className="p-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA066] to-[#FF6B6B] p-0.5 relative">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full relative">
                        <ProfileCircle isNavbar={true} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search Panel - Center */}
              <div className="flex-1 min-w-0 max-w-sm mx-auto">
                <SearchPanel />
              </div>
              
              {/* Logo - Left */}
              <div className="flex-shrink-0">
                <div className="w-9 h-9 flex items-center justify-center">
                  <img 
                    src="/logo/new.svg" 
                    alt="BuyWise" 
                    className="h-7 w-auto object-contain filter drop-shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Results Bar */}
      <SearchResults />
      
      {/* Main Content */}
      <main className="pt-[72px] pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
