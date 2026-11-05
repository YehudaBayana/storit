"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";
import { useToastStore } from "@/store/useToastStore";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes default stale time
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            const message = error?.message || "An error occurred while fetching data";
            try {
              useToastStore.getState().error(message);
            } catch {
              // fallback if store is not mounted
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            const message = error?.message || "An error occurred during the mutation";
            try {
              useToastStore.getState().error(message);
            } catch {
              // fallback if store is not mounted
            }
          },
        }),
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
