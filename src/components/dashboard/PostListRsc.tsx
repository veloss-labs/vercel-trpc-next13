import React, { use } from 'react';
import { rsc } from '~/server-rsc/trpc';
import { HydrateClient } from '~/store/HydrateClient';
import PostList from '~/components/dashboard/PostList';

export default function PostListRsc() {
  use(rsc.posts.personalList.fetchInfinite({}));

  return (
    <HydrateClient state={use(rsc.dehydrate())}>
      <PostList />
    </HydrateClient>
  );
}
