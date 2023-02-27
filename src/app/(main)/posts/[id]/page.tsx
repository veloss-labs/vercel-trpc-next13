import React from 'react';
import { rsc } from '~/server-rsc/trpc';
import { notFound } from 'next/navigation';
import EditorViewer from '~/components/shared/EditorViewer';
import { serialize } from '~/utils/hydration';

import type { Metadata } from 'next';

interface PostsByIdPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PostsByIdPageProps): Promise<Metadata> {
  const post = await rsc.posts.byId.fetch(params);
  return {
    title: {
      default: `"${post.title}"`,
      template: '%s | TRPC-NextJs13',
    },
  };
}

export default async function PostsByIdPage({ params }: PostsByIdPageProps) {
  const post = await rsc.posts.byId.fetch(params);

  if (!post) {
    notFound();
  }

  const { json } = serialize(post);

  return (
    <>
      <div>
        <time
          dateTime={post.createdAt.toDateString()}
          className="block text-sm text-slate-600"
        >
          Published on {post.createdAt.toDateString()}
        </time>
        <h1 className="mt-2 inline-block text-4xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
          {post.title}
        </h1>
      </div>
      <EditorViewer post={json as any} />
    </>
  );
}
