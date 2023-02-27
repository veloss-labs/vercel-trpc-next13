'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '~/utils/utils';
import { Icons } from '~/components/shared/Icons';
import { schema, type SignupData } from '~/libs/validation/auth';
import { trpc } from '~/store/TrpcClient';

import type { SubmitHandler } from 'react-hook-form';

type SignFormProps = React.HTMLAttributes<HTMLDivElement>;

export default function SignupForm({ className, ...props }: SignFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(schema.signup),
  });

  const router = useRouter();

  const mutation = trpc.users.create.useMutation({
    onSuccess: () => {
      router.replace('/signin');
    },
  });

  const onSubmit: SubmitHandler<SignupData> = useCallback(
    (input) => mutation.mutate(input),
    [mutation],
  );

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              placeholder="Name"
              className="custom-input__auth"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={mutation.isLoading}
              {...register('name')}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              placeholder="name@example.com"
              className="custom-input__auth"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={mutation.isLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              placeholder="Password"
              className="custom-input__auth"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={mutation.isLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
            <label className="sr-only" htmlFor="passwordConfirm">
              Password Confirm
            </label>
            <input
              id="passwordConfirm"
              placeholder="Password confirm"
              className="custom-input__auth"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={mutation.isLoading}
              {...register('passwordConfirm')}
            />
            {errors?.passwordConfirm && (
              <p className="px-1 text-xs text-red-600">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
          <button className="custom-btn__auth" disabled={mutation.isLoading}>
            {mutation.isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
