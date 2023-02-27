'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { Icons } from '~/components/shared/Icons';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  const isSignin = useMemo(() => {
    return pathname === '/signin';
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href="/"
          className="absolute top-4 left-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent py-2 px-3 text-center text-sm  font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 md:top-8 md:left-8"
        >
          <>
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-bold">
              {isSignin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-slate-600">
              {isSignin
                ? 'Enter your email to sign in to your account'
                : 'Enter your email to create a new account'}
            </p>
          </div>
          {children}
          <p className="px-8 text-center text-sm text-slate-600">
            <Link
              href={isSignin ? '/signup' : '/signin'}
              className="underline hover:text-brand"
            >
              {isSignin
                ? 'Don&apos;t have an account? Sign Up'
                : 'Already have an account? Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
