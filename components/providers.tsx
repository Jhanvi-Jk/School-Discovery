"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useCompareStore } from "@/store/compareStore";
import { useShortlistStore } from "@/store/shortlistStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Persisted stores read localStorage only after mount, so the server HTML and the first
  // client render agree (no "1" ↔ empty flicker in the header badges).
  useEffect(() => {
    useCompareStore.persist.rehydrate();
    useShortlistStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
