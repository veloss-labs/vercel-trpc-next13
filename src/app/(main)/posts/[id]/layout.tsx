import React from 'react';
import Link from 'next/link';
import { Icons } from '~/components/shared/Icons';

interface PostsByIdLayoutProps {
  params: {
    id: string;
  };
  children?: React.ReactNode;
}

export default function PostsByIdLayout({ children }: PostsByIdLayoutProps) {
  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {children}
      <hr className="my-4 border-slate-200" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/posts"
          className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
