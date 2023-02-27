'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DropdownMenu from '~/components/shared/Dropdown';
import { Icons } from '~/components/shared/Icons';
import Alert from '~/components/shared/Alert';
import { Post } from '@prisma/client';
import { trpc } from '~/store/TrpcClient';

interface PostOperationsProps {
  post: Post;
}

export default function PostOperations({ post }: PostOperationsProps) {
  const router = useRouter();

  const mutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      setShowDeleteAlert(false);
      router.refresh();
    },
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);

  const onDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      mutation.mutate({
        id: post.id,
      });
    },
    [mutation, post.id],
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-slate-50">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Link href={`/edit/${post.id}`} className="flex w-full">
                Edit
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
              onSelect={() => setShowDeleteAlert(true)}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
      <Alert open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <Alert.Content>
          <Alert.Header>
            <Alert.Title>
              Are you sure you want to delete this post?
            </Alert.Title>
            <Alert.Description>This action cannot be undone.</Alert.Description>
          </Alert.Header>
          <Alert.Footer>
            <Alert.Cancel>Cancel</Alert.Cancel>
            <Alert.Action
              className="bg-red-600 focus:ring-red-600"
              onClick={onDelete}
            >
              {mutation.isLoading ? (
                <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </Alert.Action>
          </Alert.Footer>
        </Alert.Content>
      </Alert>
    </>
  );
}
