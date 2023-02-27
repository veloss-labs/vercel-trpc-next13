// types
import { dehydrate, QueryClient } from '@tanstack/query-core';
import { createRecursiveProxy } from '@trpc/server/shared';
import { getRequestStorage } from './storage';

import type { AnyRouter, inferRouterContext } from '@trpc/server';
import type {
  CreateTRPCNextLayout,
  CreateTRPCNextLayoutOptions,
} from './types';

function getQueryKey(path: string[], input: unknown) {
  return input === undefined ? [path] : [path, input];
}

export function createTRPCNextLayout<TRouter extends AnyRouter>(
  opts: CreateTRPCNextLayoutOptions<TRouter>,
): CreateTRPCNextLayout<TRouter> {
  function getState() {
    const requestStorage = getRequestStorage<{
      _trpc: {
        queryClient: QueryClient;
        context: inferRouterContext<TRouter>;
      };
    }>();
    requestStorage._trpc = requestStorage._trpc ?? {
      cache: Object.create(null),
      context: opts.createContext(),
      queryClient: new QueryClient(),
    };
    return requestStorage._trpc;
  }
  const transformer = opts.transformer ?? {
    serialize: (v) => v,
    deserialize: (v) => v,
  };
  return createRecursiveProxy(async (callOpts) => {
    const path = [...callOpts.path];
    const lastPart = path.pop();
    const state = getState();
    const ctx = await state.context;
    const { queryClient } = state;

    if (lastPart === 'dehydrate' && path.length === 0) {
      if (queryClient.isFetching()) {
        await new Promise<void>((resolve) => {
          const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event?.query.getObserversCount() === 0) {
              resolve();
              unsubscribe();
            }
          });
        });
      }
      const dehydratedState = dehydrate(queryClient);

      return transformer.serialize(dehydratedState);
    }

    const caller = opts.router.createCaller(ctx);

    const pathStr = path.join('.');
    const input = callOpts.args[0];
    const queryKey = getQueryKey(path, input);

    if (lastPart === 'fetchInfinite') {
      return queryClient.fetchInfiniteQuery(queryKey, () =>
        caller.query(pathStr, input),
      );
    }

    return queryClient.fetchQuery(queryKey, () => caller.query(pathStr, input));
  }) as CreateTRPCNextLayout<TRouter>;
}
