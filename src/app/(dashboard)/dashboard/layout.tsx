import React from 'react';
import { redirect } from 'next/navigation';
import { rsc } from '~/server-rsc/trpc';
import MainNav from '~/components/shared/MainNav';
import { UserAccountNav } from '~/components/shared/UserAccountNav';
import DashboardNav from '~/components/dashboard/DashboardNav';
import type { Metadata } from 'next';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  const session = await rsc.session.fetch();

  const name = session?.profile?.name || 'Guest';

  return {
    title: {
      default: 'Dashboard',
      template: '%s | TRPC-NextJs13',
    },
    description: `Welcome to your dashboard, ${name}.`,
    creator: `${name}`,
    keywords: ['dashboard', 'posts', name],
  };
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const session = await rsc.session.fetch();

  if (!session) {
    return redirect('/signin');
  }

  return (
    <div className="mx-auto flex flex-col space-y-6">
      <header className="container sticky top-0 z-40 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-b-slate-200 py-4">
          <MainNav
            items={[
              {
                href: '/posts',
                title: 'Blog',
              },
            ]}
          />
          <UserAccountNav session={session} />
        </div>
      </header>
      <div className="container grid gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav
            items={[
              {
                title: 'Posts',
                href: '/dashboard',
                icon: 'post',
              },
            ]}
          />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {props.children}
        </main>
      </div>
    </div>
  );
}
