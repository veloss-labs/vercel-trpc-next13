'use client';
import React, { useMemo } from 'react';
import superjson from 'superjson';
import { Hydrate } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';
import type { DataTransformer } from '@trpc/server';

function createHydrateClient(opts: { transformer?: DataTransformer }) {
  return function HydrateClient(props: {
    children: React.ReactNode;
    state: DehydratedState;
  }) {
    const { state, children } = props;

    const transformedState: DehydratedState = useMemo(() => {
      if (opts.transformer) {
        return opts.transformer.deserialize(state);
      }
      return state;
    }, [state]);
    return <Hydrate state={transformedState}>{children}</Hydrate>;
  };
}

export const HydrateClient = createHydrateClient({
  transformer: superjson,
});
