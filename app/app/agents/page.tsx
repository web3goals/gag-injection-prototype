"use client";

import { AgentsSection } from "@/components/agents/agents-section";
import { LoadingSection } from "@/components/loading-section";
import { LoginSection } from "@/components/login-section";
import { usePrivy } from "@privy-io/react-auth";

export default function AgentsPage() {
  const { ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    return <AgentsSection />;
  }

  if (ready && !authenticated) {
    return <LoginSection />;
  }

  return <LoadingSection />;
}
