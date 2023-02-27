import '~/assets/styles/globals.css';

import React from 'react';
import { redirect } from 'next/navigation';

// components
import AuthLayout from '~/components/auth/AuthLayout';

// trpc
import { rsc } from '~/server-rsc/trpc';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: {
    default: 'Auth',
    template: '%s | TRPC-NextJs13',
  },
};

export default async function AuthRootLayout(props: RootLayoutProps) {
  const session = await rsc.session.fetch();

  if (session) {
    redirect('/');
  }

  return <AuthLayout>{props.children}</AuthLayout>;
}
