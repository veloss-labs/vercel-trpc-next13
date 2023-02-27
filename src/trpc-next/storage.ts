/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { AsyncLocalStorage } from 'async_hooks';

export const asyncStorage: AsyncLocalStorage<any> | {} =
  require('next/dist/client/components/request-async-storage').requestAsyncStorage;

function throwError(msg: string) {
  throw new Error(msg);
}

export function getRequestStorage<T>(): T {
  if ('getStore' in asyncStorage) {
    return asyncStorage.getStore() ?? throwError("Couldn't get async storage");
  }

  return asyncStorage as T;
}
