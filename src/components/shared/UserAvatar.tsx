import React from 'react';
import { AvatarProps } from '@radix-ui/react-avatar';

import { Icons } from '~/components/shared/Icons';
import { Avatar } from '~/components/shared/Avatar';

import type { UserSchema } from '~/server-rsc/getSession';

interface UserAvatarProps extends AvatarProps {
  session: UserSchema;
}

export default function UserAvatar({ session, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <Avatar.Image alt="Picture" src={session.profile.image ?? undefined} />
      <Avatar.Fallback>
        <span className="sr-only">{session.profile.name}</span>
        <Icons.user className="h-4 w-4" />
      </Avatar.Fallback>
    </Avatar>
  );
}
