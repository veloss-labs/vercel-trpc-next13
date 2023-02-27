import { notFound } from 'next/navigation';
import React from 'react';
import Editor from '~/components/shared/Editor';
import { rsc } from '~/server-rsc/trpc';
import { serialize } from '~/utils/hydration';

import type { Metadata } from 'next';

interface EditByIdPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EditByIdPageProps): Promise<Metadata> {
  const post = await rsc.posts.byId.fetch(params);
  return {
    title: {
      default: `"${post.title}" Edit`,
      template: '%s | TRPC-NextJs13',
    },
  };
}

export default async function EditByIdPage({ params }: EditByIdPageProps) {
  const post = await rsc.posts.byId.fetch(params);

  if (!post) {
    notFound();
  }

  const { json } = serialize(post);

  return <Editor post={json as any} />;
}
