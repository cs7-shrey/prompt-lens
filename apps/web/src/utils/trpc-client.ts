import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { env } from '@prompt-lens/env/web';
import type { AppRouter } from '@prompt-lens/api/routers/index';

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            },
        },
    ),
    ],
});

export function createServerTRPCClient(headers: HeadersInit) {
    return createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${env.NEXT_PUBLIC_SERVER_URL}/trpc`,
          headers,  // Pass the headers here
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    });
  }