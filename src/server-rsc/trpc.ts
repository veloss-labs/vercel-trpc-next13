import { createTRPCNextLayout } from '~/trpc-next/createTRPCNextLayout';
import superjson from 'superjson';
import { appRouter } from '~/server/routers/app';
import { createContext } from '~/server/context';
import { prisma } from '~/server/prisma';
import { getSession } from '~/server-rsc/getSession';

export const rsc = createTRPCNextLayout({
  router: appRouter,
  transformer: superjson,
  createContext() {
    return createContext({
      type: 'rsc',
      getSession,
      prisma,
    });
  },
});
