import React from 'react';
import { cn } from '~/utils/utils';
import Skeleton from '~/components/shared/Skeleton';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('overflow-hidden rounded-lg border', className)}
      {...props}
    />
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

Card.Header = function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('grid gap-1 p-6', className)} {...props} />;
};

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

Card.Content = function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('px-6 pb-4', className)} {...props} />;
};

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

Card.Footer = function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('border-t bg-slate-50 px-6 py-4', className)}
      {...props}
    />
  );
};

type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

Card.Title = function CardTitle({ className, ...props }: CardTitleProps) {
  return <h4 className={cn('text-lg font-medium', className)} {...props} />;
};

type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

Card.Description = function CardDescription({
  className,
  ...props
}: CardDescriptionProps) {
  return <p className={cn('text-sm text-gray-600', className)} {...props} />;
};

Card.Skeleton = function CardSeleton() {
  return (
    <Card>
      <Card.Header className="gap-2">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-4 w-4/5" />
      </Card.Header>
      <Card.Content className="h-10" />
      <Card.Footer>
        <Skeleton className="h-8 w-[120px] bg-slate-200" />
      </Card.Footer>
    </Card>
  );
};
