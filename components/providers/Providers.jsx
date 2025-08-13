'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ProductModalProvider } from '@/contexts/ProductModalContext';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <ProductModalProvider>
            {children}
          </ProductModalProvider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
