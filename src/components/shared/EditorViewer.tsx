'use client';
import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';

import { schema } from '~/libs/validation/post';
import { getTargetElement, isBrowser } from '~/libs/browser/dom';

import { parse } from '~/utils/hydration';

import type { Post } from '@prisma/client';

interface EditorViewerProps {
  post?: Post;
}

export default function EditorViewer({ post }: EditorViewerProps) {
  const $editor = useRef<EditorJS | null>(null);

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
        readOnly: true,
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

  if (!isMounted) {
    return null;
  }

  return <div id="editor" className="editor-viewer min-h-[500px]" />;
}
