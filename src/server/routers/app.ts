/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '~/server/trpc';
import { usersRouter } from '~/server/routers/users';
import { postsRouter } from './posts';

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { UserSchema } from '~/server-rsc/getSession';

export const appRouter = router({
  health: publicProcedure.query(() => 'ok'),
  session: publicProcedure.query(({ ctx }) => ctx.session as UserSchema),
  users: usersRouter,
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
