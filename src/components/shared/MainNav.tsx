'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSelectedLayoutSegment } from 'next/navigation';

import { Icons } from '~/components/shared/Icons';
import MobileNav from '~/components/shared/MobileNav';
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

export default function MainNav({ items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="w-6 h-6" />
        <span className="hidden font-bold sm:inline-block">
          NextJs With TRPC
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => {
            const href = item.disabled ? '/' : item.href;
            return (
              <Link
                key={index}
                href={href}
                className={cn(
                  'flex items-center text-lg font-semibold text-slate-600 sm:text-sm',
                  item.href.startsWith(`/${segment}`) && 'text-slate-900',
                  item.disabled && 'cursor-not-allowed opacity-80',
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && <MobileNav items={items}>{children}</MobileNav>}
    </div>
  );
}
