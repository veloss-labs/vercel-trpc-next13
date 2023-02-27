'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/utils/utils';
import { Icons } from '~/components/shared/Icons';

interface Item {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
}

interface DashboardNavProps {
  items: Item[];
}

export default function DashboardNav({ items }: DashboardNavProps) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon];
        const href = item.disabled ? '/' : item.href;
        return (
          <Link key={index} href={href}>
            <span
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100',
                path === item.href ? 'bg-slate-200' : 'transparent',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
