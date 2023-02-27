import type { DehydratedState } from '@tanstack/react-query';
import type {
  DataTransformer,
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterContext,
  MaybePromise,
  AnyRouter,
  AnyProcedure,
  AnyQueryProcedure,
  ProcedureRouterRecord,
} from '@trpc/server';

export interface CreateTRPCNextLayoutOptions<TRouter extends AnyRouter> {
  router: TRouter;
  createContext: () => MaybePromise<inferRouterContext<TRouter>>;
  transformer?: DataTransformer;
}

/**
 * @internal
 */
export type DecorateProcedure<TProcedure extends AnyProcedure> =
  TProcedure extends AnyQueryProcedure
    ? {
        fetch(
          input: inferProcedureInput<TProcedure>,
        ): Promise<inferProcedureOutput<TProcedure>>;
        fetchInfinite(
          input: inferProcedureInput<TProcedure>,
        ): Promise<inferProcedureOutput<TProcedure>>;
      }
    : never;

type OmitNever<TType> = Pick<
  TType,
  {
    [K in keyof TType]: TType[K] extends never ? never : K;
  }[keyof TType]
>;
/**
 * @internal
 */
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TPath extends string = '',
> = OmitNever<{
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
        TProcedures[TKey]['_def']['record'],
        `${TPath}${TKey & string}.`
      >
    : TProcedures[TKey] extends AnyQueryProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
}>;

export type CreateTRPCNextLayout<TRouter extends AnyRouter> =
  DecoratedProcedureRecord<TRouter['_def']['record']> & {
    dehydrate(): Promise<DehydratedState>;
  };
