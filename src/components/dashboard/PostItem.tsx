import React from 'react';
import Link from 'next/link';
import { Post } from '@prisma/client';
import Skeleton from '~/components/shared/Skeleton';
import PostOperations from '~/components/dashboard/PostOperations';

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/posts/${post.id}`}
          className="font-semibold hover:underline"
        >
          {post.title}
        </Link>
        <div>
          <p className="text-sm text-slate-600">
            {post.createdAt?.toDateString()}
          </p>
        </div>
      </div>
      <PostOperations post={post} />
    </div>
  );
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
