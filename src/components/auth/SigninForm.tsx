'use client';
import React, { useCallback, useState } from 'react';

// hooks
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '~/utils/utils';
import { Icons } from '~/components/shared/Icons';
import { schema, type SigninData } from '~/libs/validation/auth';

import type { SubmitHandler } from 'react-hook-form';

type SignFormProps = React.HTMLAttributes<HTMLDivElement>;

export default function SigninForm({ className, ...props }: SignFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninData>({
    resolver: zodResolver(schema.signin),
  });

  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit: SubmitHandler<SigninData> = useCallback(
    async (input) => {
      setLoading(true);
      try {
        const resp = await signIn('credentials', {
          ...input,
          redirect: false,
        });

        if (resp) {
          if (!resp.error && resp?.ok) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-2">
          <div className="grid gap-1">
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
              disabled={isLoading}
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
              disabled={isLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className="custom-btn__auth" disabled={isLoading}>
            {isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-600">Or continue with</span>
        </div>
      </div>
      <button
        type="button"
        className="custom-btn__auth__github"
        // onClick={() => signIn('github')}
        disabled={isLoading}
      >
        <Icons.github className="mr-2 h-4 w-4" />
        Github
      </button>
    </div>
  );
}
