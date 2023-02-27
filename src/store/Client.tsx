'use client';

interface ClientProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProps) {
  return <>{children}</>;
}
