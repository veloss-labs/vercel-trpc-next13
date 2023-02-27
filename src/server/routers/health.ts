import { router, publicProcedure } from '~/server/trpc';

export const healthRouter = router({
  ok: publicProcedure.query(() => 'ok'),
  check: publicProcedure.query(() => 'check'),
});
