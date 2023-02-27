import NextAuth, { NextAuthOptions } from 'next-auth';
import omit from 'lodash-es/omit';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '~/server/prisma';
import { generateHash, secureCompare } from '~/utils/password';
import type { UserSchema } from '~/server-rsc/getSession';
import type { DefaultSession } from 'next-auth';

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: UserSchema;
  }
}

export const nextAuthOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, token }) => {
      // I skipped the line below coz it gave me a TypeError
      // session.accessToken = token.accessToken;
      if (session && session.user && token.session) {
        // @ts-ignore
        session.user = token.session;
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          session: user,
        };
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            password: true,
            salt: true,
            profile: {
              select: {
                bio: true,
                image: true,
                name: true,
              },
            },
          },
        });

        if (!user) {
          return null;
        }

        if (user.password && user.salt) {
          if (
            !secureCompare(
              user.password,
              generateHash(credentials.password, user.salt),
            )
          ) {
            return null;
          }
        }

        const omitUser = omit(user, ['password', 'salt']);
        return omitUser;
      },
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
    }),
  ],
};

export default NextAuth(nextAuthOptions);
