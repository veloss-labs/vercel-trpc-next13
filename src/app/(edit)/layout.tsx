import React from 'react';
import { redirect } from 'next/navigation';
import { rsc } from '~/server-rsc/trpc';

interface EditorLayoutProps {
  children?: React.ReactNode;
}

export default async function EditorLayout({ children }: EditorLayoutProps) {
  const session = await rsc.session.fetch();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      {children}
    </div>
  );
}
