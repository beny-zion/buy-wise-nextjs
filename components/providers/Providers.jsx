'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ProductModalProvider } from '@/contexts/ProductModalContext';

const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  
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
