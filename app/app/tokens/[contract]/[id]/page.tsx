"use client";

import { useParams } from "next/navigation";

export default function TokenPage() {
  const { contract, id } = useParams();

  return (
    <main className="container py-16 lg:px-80">
      <p>Token page...</p>
      <p>Contract: {contract}</p>
      <p>ID: {id}</p>
    </main>
  );
}
