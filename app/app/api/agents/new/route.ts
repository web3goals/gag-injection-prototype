"use server";

import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  creatorId: z.string().min(1),
  creatorAddress: z.string().min(1),
  style: z.string().min(1),
  network: z.string().min(1),
  accounts: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    // Get and parse request data
    const body = await request.json();
    const bodyParseResult = requestBodySchema.safeParse(body);
    if (!bodyParseResult.success) {
      return createFailedApiResponse(
        {
          message: `Request body invalid: ${JSON.stringify(bodyParseResult)}`,
        },
        400
      );
    }

    // Create an agent
    const agent: Agent = {
      creatorId: bodyParseResult.data.creatorId,
      creatorAddress: bodyParseResult.data.creatorAddress,
      createdDate: new Date(),
      style: bodyParseResult.data.style,
      network: bodyParseResult.data.network,
      accounts: bodyParseResult.data.accounts,
    };

    const agentId = await insertAgent(agent);
    agent._id = agentId;
    console.log("Agent is inserted to MongoDB");

    // Return the agent
    return createSuccessApiResponse(agent);
  } catch (error) {
    console.error(
      `Failed to process ${request.method} request for "${
        new URL(request.url).pathname
      }":`,
      errorToString(error)
    );
    return createFailedApiResponse(
      { message: "Internal server error, try again later" },
      500
    );
  }
}
