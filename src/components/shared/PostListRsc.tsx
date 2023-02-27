import React, { use } from 'react';
import { rsc } from '~/server-rsc/trpc';
import { HydrateClient } from '~/store/HydrateClient';
import PostList from '~/components/shared/PostList';

export default function PostListRsc() {
  use(rsc.posts.list.fetchInfinite({}));

  return (
    <HydrateClient state={use(rsc.dehydrate())}>
      <PostList />
    </HydrateClient>
  );
}
