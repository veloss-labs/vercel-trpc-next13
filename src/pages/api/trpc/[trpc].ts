import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from '~/server/context';
import { prisma } from '~/server/prisma';
import { appRouter } from '~/server/routers/app';

export default createNextApiHandler({
  router: appRouter,
  createContext(opts) {
    return createContext({
      type: 'api',
      prisma: prisma,
      ...opts,
    });
  },
});
