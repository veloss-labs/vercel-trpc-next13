import React from 'react';
import { cn } from '~/utils/utils';

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function DashboardShell({
  className,
  children,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  );
}
