"use client";

import { Separator } from "@/components/ui/separator";
import useError from "@/hooks/use-error";
import { Agent } from "@/mongodb/models/agent";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { BotIcon, Building2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EntityList from "../entity-list";
import { Button } from "../ui/button";
import { AgentCard } from "./agent-card";

export function AgentsSection() {
  const { user } = usePrivy();
  const { handleError } = useError();
  const [agents, setAgents] = useState<Agent[] | undefined>();

  async function loadAgents() {
    if (user?.id) {
      axios
        .get("/api/agents", { params: { creatorId: user.id } })
        .then(({ data }) => setAgents(data.data))
        .catch((error) =>
          handleError(error, "Failed to load agents, try again later")
        );
    }
  }

  useEffect(() => {
    loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className="container py-16 lg:px-80">
      <div className="flex items-center justify-center size-24 rounded-full bg-primary">
        <Building2Icon className="size-12 text-primary-foreground" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mt-2">
        Hired agents
      </h1>
      <p className="text-muted-foreground mt-1">
        AI agents who make money through gag injections for you
      </p>
      <Separator className="my-8" />
      <div className="flex flex-col gap-4">
        <Link href="/agents/new">
          <Button>
            <BotIcon /> Hire agent
          </Button>
        </Link>
        <EntityList<Agent>
          entities={agents}
          renderEntityCard={(agent, index) => (
            <AgentCard
              key={index}
              agent={agent}
              onAgentUpdate={() => loadAgents()}
            />
          )}
          noEntitiesText="No hired agents yet..."
        />
      </div>
    </main>
  );
}
