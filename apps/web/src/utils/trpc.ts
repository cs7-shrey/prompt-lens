import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@prompt-lens/api/routers/index';
import superjson from 'superjson';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

