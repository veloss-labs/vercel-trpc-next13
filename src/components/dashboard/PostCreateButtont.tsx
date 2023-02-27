'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '~/utils/utils';
import { Icons } from '~/components/shared/Icons';

type PostCreateButtonProps = Omit<
  React.HTMLAttributes<HTMLButtonElement>,
  'onClick'
>;

export default function PostCreateButtont({
  className,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push('/edit');
  }, [router]);

  return (
    <button
      className={cn(
        'relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      Write
    </button>
  );
}
