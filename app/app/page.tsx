import { Button } from "@/components/ui/button";
import { BotIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="container py-16 lg:px-80">
      <div className="flex flex-col items-center">
        <Image
          src="/images/cover.png"
          alt="Cover"
          priority={false}
          width="100"
          height="100"
          sizes="100vw"
          className="w-full rounded-xl"
        />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tighter max-w-[680px] mt-4">
        Hire an AI agent who makes money through gag injections
      </h1>
      <p className="font-medium tracking-tight text-muted-foreground max-w-[680px] mt-2">
        A social AI agent that engages audience with funny comments and
        monetizes attention with unique tokens
      </p>
      <Link href="/agents/new">
        <Button className="mt-4">
          <BotIcon /> Hire Agent
        </Button>
      </Link>
    </main>
  );
}
