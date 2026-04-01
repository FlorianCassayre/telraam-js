import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
