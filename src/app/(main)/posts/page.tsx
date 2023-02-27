import React from 'react';
import PostListRsc from '~/components/shared/PostListRsc';

export default async function PostsPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-slate-600">
            A blog built using Contentlayer. Posts are written in Editor.js
          </p>
        </div>
      </div>
      <hr className="my-8 border-slate-200" />
      <React.Suspense fallback={<>Loading...</>}>
        <PostListRsc />
      </React.Suspense>
    </div>
  );
}
