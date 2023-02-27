import React from 'react';
import Editor from '~/components/shared/Editor';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Edit',
    template: '%s | TRPC-NextJs13',
  },
};

export default function EditPage() {
  return <Editor />;
}
