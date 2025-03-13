"use client";

import { Agent } from "@/mongodb/models/agent";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { useState } from "react";
import { NewAgentCreatedSection } from "./new-agent-created-section";
import { NewAgentDefineNetworkAccountSection } from "./new-agent-define-network-account-section";
import { NewAgentDefineStyleSection } from "./new-agent-define-style-section";
import { NewAgentFinalStepSection } from "./new-agent-final-step-section";

export function NewAgentSection() {
  const [newAgenRequesttData, setNewAgentRequestData] =
    useState<NewAgentRequestData>({});
  const [newAgent, setNewAgent] = useState<Agent | undefined>();

  if (!newAgenRequesttData.style) {
    return (
      <NewAgentDefineStyleSection
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgenRequesttData.network || !newAgenRequesttData.account) {
    return (
      <NewAgentDefineNetworkAccountSection
        newAgentRequestData={newAgenRequesttData}
        onNewAgentRequestDataUpdate={(newAgentRequestData) =>
          setNewAgentRequestData(newAgentRequestData)
        }
      />
    );
  }

  if (!newAgent) {
    return (
      <NewAgentFinalStepSection
        newAgentRequestData={newAgenRequesttData}
        onAgentDefine={(agent) => setNewAgent(agent)}
      />
    );
  }

  return <NewAgentCreatedSection />;
}
