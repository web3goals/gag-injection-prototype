"use client";

import { PrivyProvider as OriginalPrivyProvider } from "@privy-io/react-auth";

export default function PrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OriginalPrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{}}
    >
      {children}
    </OriginalPrivyProvider>
  );
}
