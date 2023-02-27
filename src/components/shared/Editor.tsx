'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Link from 'next/link';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from '~/components/shared/Toast';
import { Icons } from '~/components/shared/Icons';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '~/libs/validation/post';
import { useRouter } from 'next/navigation';
import { getTargetElement, isBrowser } from '~/libs/browser/dom';

import { trpc } from '~/store/TrpcClient';
import { parse, stringify } from '~/utils/hydration';
import logger from '~/utils/logger';

import type { SubmitHandler } from 'react-hook-form';
import type { EditData } from '~/libs/validation/post';
import type { Post } from '@prisma/client';

interface EditorProps {
  post?: Post;
}

export default function Editor({ post }: EditorProps) {
  const { register, handleSubmit } = useForm<EditData>({
    resolver: zodResolver(schema.edit),
  });

  const $editor = useRef<EditorJS | null>(null);
  const router = useRouter();

  const mutation = trpc.posts.create.useMutation({
    onSuccess(data) {
      logger.log('api', 'create', data);
      router.refresh();
      return toast({
        message: 'Your post has been saved.',
        type: 'success',
      });
    },
    onError(error) {
      logger.error('api', error);
      return toast({
        title: 'Something went wrong.',
        message: 'Your post was not saved. Please try again.',
        type: 'error',
      });
    },
  });

  const [isMounted, setIsMounted] = useState<boolean>(false);

  async function initializeEditor() {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    // @ts-ignore
    const Header = (await import('@editorjs/header')).default;
    // @ts-ignore
    const Embed = (await import('@editorjs/embed')).default;
    // @ts-ignore
    const Table = (await import('@editorjs/table')).default;
    // @ts-ignore
    const List = (await import('@editorjs/list')).default;
    // @ts-ignore
    const Code = (await import('@editorjs/code')).default;
    // @ts-ignore
    const LinkTool = (await import('@editorjs/link')).default;
    // @ts-ignore
    const InlineCode = (await import('@editorjs/inline-code')).default;

    const body = post ? schema.edit.parse(post) : null;

    const _editor = getTargetElement($editor);

    if (!_editor) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          $editor.current = editor;
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: body?.content ? parse<any>(body?.content) : undefined,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }

  useEffect(() => {
    if (isBrowser) {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        const _editor = getTargetElement($editor);

        _editor?.destroy();
        $editor.current = null;
      };
    }
  }, [isMounted]);

  const onSubmit: SubmitHandler<EditData> = useCallback(
    async (input) => {
      try {
        const _editor = getTargetElement($editor);
        const blocks = await _editor?.save();
        const content = stringify(blocks);
        console.log(content);
        mutation.mutate({
          title: input.title,
          content,
          published: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [mutation],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between space-x-4">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg border border-transparent bg-transparent py-2 pl-3 pr-5 text-sm font-medium text-slate-900 hover:border-slate-200 hover:bg-slate-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-slate-700"
            >
              <>
                <Icons.arrowLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-slate-600">
              {post?.published ? 'Published' : 'Draft'}
            </p>
          </div>
          <button
            type="submit"
            className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            {mutation.isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto md:w-[800px]">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post?.title}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden text-5xl font-bold focus:outline-none"
            {...register('title')}
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{' '}
            <kbd className="rounded-md border bg-slate-50 px-1 text-xs uppercase">
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
}
