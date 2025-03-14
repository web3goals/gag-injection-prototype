"use client";

import { TokenSection } from "@/components/tokens/token-section";
import { useParams } from "next/navigation";

export default function TokenPage() {
  const { address, id } = useParams();

  return <TokenSection address={address as string} id={id as string} />;
}
