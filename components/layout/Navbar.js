'use client';

import { useState } from 'react';

export default function Navbar() {
  const [search, setSearch] = useState('');

  return (
    <header className="fixed top-0 right-0 left-0 z-40 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#FFA066] to-[#FF6B6B] bg-clip-text text-transparent">
            Buy Wise
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <input
              type="text"
              placeholder="חיפוש מוצרים..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#FFA066]"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFA066] to-[#FF6B6B] p-0.5">     
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-[#FFA066]">👤</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
