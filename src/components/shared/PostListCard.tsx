import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '~/components/shared/Skeleton';
import { parse } from '~/utils/hydration';

import type { Post } from '@prisma/client';

interface PostListCardProps {
  post: Post;
}

export default function PostListCard({ post }: PostListCardProps) {
  const content = useMemo(() => {
    const _content = parse<any>(post.content);
    const _blocks = _content?.blocks ?? [];
    const descriptions = _blocks
      .filter((block: any) => block.type === 'paragraph')
      .map((block: any) => block.data?.text ?? '')
      .join(' ');
    // max length of 200 characters
    return descriptions.slice(0, 200);
  }, [post.content]);

  return (
    <article className="group relative flex flex-col space-y-2">
      <Image
        src={'/images/blog-post-1.jpg'}
        alt={post.title}
        width={804}
        height={452}
        className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
      />
      <h2 className="text-2xl font-extrabold">{post.title}</h2>

      <p className="text-slate-600">{content}</p>

      {post.createdAt && (
        <p className="text-sm text-slate-600">
          {post.createdAt.toDateString()}
        </p>
      )}
      <Link href={`/posts/${post.id}`} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}

PostListCard.Skeleton = function PostListCardSkeleton() {
  return (
    <article className="group relative flex flex-col space-y-2">
      <div className="rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900">
        <Skeleton className="h-48 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <Link href="#" className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
};
