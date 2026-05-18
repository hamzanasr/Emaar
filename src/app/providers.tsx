'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/api';

/**
 * Global Providers wrapper
 * - React Query for server state
 * - Hydrates API client with the persisted access token
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  // Sync access token from store → API client on app mount
  const accessToken = useAuthStore((s) => s.accessToken);
  React.useEffect(() => {
    if (accessToken) {
      api.setToken(accessToken);
    } else {
      api.clearToken();
    }
  }, [accessToken]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
