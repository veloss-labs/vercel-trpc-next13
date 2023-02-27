'use client';
import ClientProvider from './Client';
import TrpcClientProvider from './TrpcClient';

interface ProviderProps {
  children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  return (
    <TrpcClientProvider>
      <ClientProvider>{children}</ClientProvider>
    </TrpcClientProvider>
  );
}
