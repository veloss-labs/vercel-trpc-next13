import '~/assets/styles/globals.css';

import React from 'react';
import { Inter as FontSans } from 'next/font/google';

import Provider from '~/store/Provider';
import { cn } from '~/utils/utils';
import type { Metadata } from 'next';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '%s | TRPC-NextJs13',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
    ],
  },
  description: `I'm building a web app with Next.js 13 and open sourcing everything. Follow along as we figure this out together.`,
  keywords: [
    'Next.js',
    'TRPC',
    'Prisma',
    'React',
    'Typescript',
    'Tailwind',
    'Vercel',
  ],
  themeColor: '#ffffff',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout(props: RootLayoutProps) {
  return (
    <Provider>
      <html
        lang="en"
        className={cn(
          'bg-white font-sans text-slate-900 antialiased',
          fontSans.variable,
        )}
      >
        <head />
        <body className="min-h-screen">{props.children}</body>
      </html>
    </Provider>
  );
}
