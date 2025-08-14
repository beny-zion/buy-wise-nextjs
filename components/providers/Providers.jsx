'use client';

// components/providers/Providers.jsx - מעודכן עם כל הקונטקסטים
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { SearchProvider } from '@/contexts/SearchContext';

// QueryClient configuration
const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

export function Providers({ children }) {
  // Create QueryClient instance
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          {children}
        </SearchProvider>
      </AuthProvider>
      
      {/* React Query Devtools - only in development */}
      {process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}