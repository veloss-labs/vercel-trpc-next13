import { AsyncLocalStorage } from 'async_hooks';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

// types
import type { User, UserProfile } from '@prisma/client';

interface LocalStorageContext {
  // eslint-disable-next-line @typescript-eslint/ban-types
  trpc: {};
}
const asyncStorage: AsyncLocalStorage<LocalStorageContext> =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('next/dist/client/components/request-async-storage').requestAsyncStorage;

asyncStorage.getStore();

export interface UserSchema extends Pick<User, 'id' | 'email'> {
  profile: Pick<UserProfile, 'name' | 'image' | 'bio'>;
}

export async function getSession(): Promise<UserSchema | null> {
  const newCookies = cookies()
    .getAll()
    .reduce((cookiesObj, cookie) => {
      cookiesObj[cookie.name] = cookie.value;
      return cookiesObj;
    }, {} as Record<string, string>);

  const token = await getToken({
    req: {
      cookies: newCookies,
      headers: {},
    } as any,
  });

  if (!token) {
    return null;
  }

  // TODO: add more fields
  return token.session as UserSchema;
}
