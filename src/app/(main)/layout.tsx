import Link from 'next/link';
import MainNav from '~/components/shared/MainNav';
import SiteFooter from '~/components/shared/SiteFooter';
import { UserAccountNav } from '~/components/shared/UserAccountNav';
import { rsc } from '~/server-rsc/trpc';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await rsc.session.fetch();

  return (
    <div className="flex min-h-screen flex-col">
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
          <nav>
            {session ? (
              <UserAccountNav session={session} />
            ) : (
              <Link
                href="/signin"
                className="relative inline-flex h-8 items-center rounded-md border border-transparent bg-brand-500 px-6 py-1 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
