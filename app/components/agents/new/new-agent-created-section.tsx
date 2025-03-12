"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EyeIcon, PartyPopperIcon } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";

export function NewAgentCreatedSection() {
  return (
    <main className="container py-16 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <PartyPopperIcon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Agent hired!
      </h1>
      <p className="text-muted-foreground mt-1">
        Relax, the agent is working for you now
      </p>
      <Separator className="my-8" />
      <Link href="/agents">
        <Button>
          <EyeIcon /> Explore Hired Agents
        </Button>
      </Link>
      <Confetti
        width={document.body.clientWidth}
        height={document.body.scrollHeight}
        recycle={false}
      />
    </main>
  );
}
