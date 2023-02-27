'use client';
import React, { useEffect, useRef } from 'react';
import { trpc } from '~/store/TrpcClient';
import useIsIntersecting from '~/libs/hooks/useIsIntersecting';
import { EmptyPlaceholder } from '~/components/dashboard/EmptyPlaceholder';
import PostCreateButtont from '~/components/dashboard/PostCreateButtont';
import PostListCard from '~/components/shared/PostListCard';

export default function PostList() {
  const [isLoadMoreVisible, _] = useIsIntersecting<HTMLDivElement>();

  const query = trpc.posts.list.useInfiniteQuery(
    {},
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
      refetchOnMount: false,
      staleTime: Infinity,
    },
  );

  const fetchNextPageRef = useRef(query.fetchNextPage);
  fetchNextPageRef.current = query.fetchNextPage;

  useEffect(() => {
    if (isLoadMoreVisible && query.hasNextPage && !query.isFetching) {
      fetchNextPageRef.current();
    }
  }, [isLoadMoreVisible, query.hasNextPage, query.isFetching]);

  if (query.isFetching && !query.data) {
    return <PostList.Skeleton />;
  }

  if (!query.data?.pages?.length) {
    return <PostList.Empty />;
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {query.data?.pages.map((page, index) => (
        <React.Fragment key={index}>
          {page.items.map((post) => (
            <PostListCard key={post.id} post={post as any} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

PostList.Empty = function Empty() {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="post" />
      <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don&apos;t have any posts yet. Start creating content.
      </EmptyPlaceholder.Description>
      <PostCreateButtont className="border-slate-200 bg-white text-brand-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2" />
    </EmptyPlaceholder>
  );
};

PostList.Skeleton = function Skeleton() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {[...Array(3)].map((_, index) => (
        <PostListCard.Skeleton key={index} />
      ))}
    </div>
  );
};
