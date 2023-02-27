'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

import DropdownMenu from '~/components/shared/Dropdown';
import UserAvatar from '~/components/shared/UserAvatar';

// types
import type { UserSchema } from '~/server-rsc/getSession';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  session: UserSchema;
}

export function UserAccountNav({ session }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 focus-visible:outline-none">
        <UserAvatar session={session} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-2 md:w-[240px]" align="end">
          <div className="flex items-center justify-start gap-2 p-4">
            <div className="flex flex-col space-y-1 leading-none">
              {session.profile.name && (
                <p className="font-medium">{session.profile.name}</p>
              )}
              {session.email && (
                <p className="w-[200px] truncate text-sm text-slate-600">
                  {session.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <Link href="/dashboard" className="w-full">
              Dashboard
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              signOut({
                callbackUrl: '/signin',
              });
            }}
          >
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
