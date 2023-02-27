/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getServerSession } from 'next-auth';
import { getSession } from '~/server-rsc/getSession';
import { nextAuthOptions } from '~/pages/api/auth/[...nextauth]';
import { prisma, Prisma } from '~/server/prisma';

type CreateContextOpts =
  | {
      type: 'rsc';
      getSession: typeof getSession;
      prisma: Prisma;
    }
  | (trpcNext.CreateNextContextOptions & {
      type: 'api';
      prisma: Prisma;
    });

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: CreateContextOpts, // HACKs because we can't import `next/cookies` in `/api`-routes
) {
  // for API-response caching see https://trpc.io/docs/caching
  if (opts.type === 'rsc') {
    // RSC
    return {
      type: opts.type,
      session: await opts.getSession(),
      prisma,
    };
  }

  // not RSC
  const session = await getServerSession(opts.req, opts.res, nextAuthOptions);

  return {
    type: opts.type,
    session: session?.user,
    prisma,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
