'use client';
import React from 'react';
import Link from 'next/link';

import { Icons } from '~/components/shared/Icons';
import { cn } from '~/utils/utils';

interface Item {
  title: string;
  href: string;
  disabled?: boolean;
}

interface MainNavProps {
  items: Item[];
  children?: React.ReactNode;
}

export default function MobileNav({ items, children }: MainNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden',
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-white p-4 shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="w-6 h-6" />
          <span className="font-bold">NextJs With TRPC</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => {
            const href = item.disabled ? '/' : item.href;
            return (
              <Link
                key={index}
                href={href}
                className={cn(
                  'flex w-full items-center rounded-md px-2 py-2 text-sm font-medium hover:underline',
                  item.disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
