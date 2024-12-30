'use client';

import useGlobalStore, { GlobalStore } from '@/config/use-global';
import { Logout } from '@/utils/common';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';

export default function Providers({
  children,
  common,
  user,
}: {
  children: React.ReactNode;
  common: Partial<GlobalStore['common']>;
  user: GlobalStore['user'];
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
          },
        },
      }),
  );

  const { setCommon, setUser } = useGlobalStore();

  useEffect(() => {
    if (user) {
      setUser(user);
    } else {
      Logout();
    }
  }, [setUser, user]);

  useEffect(() => {
    setCommon(common);
  }, [setCommon, common]);

  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
