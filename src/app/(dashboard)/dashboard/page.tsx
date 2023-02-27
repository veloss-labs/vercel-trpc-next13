import React from 'react';
import DashboardHeader from '~/components/dashboard/DashboardHeader';
import DashboardShell from '~/components/dashboard/DashboardShell';
import PostCreateButtont from '~/components/dashboard/PostCreateButtont';
import PostListRsc from '~/components/dashboard/PostListRsc';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButtont />
      </DashboardHeader>
      <React.Suspense fallback={<>Loading...</>}>
        <PostListRsc />
      </React.Suspense>
    </DashboardShell>
  );
}
