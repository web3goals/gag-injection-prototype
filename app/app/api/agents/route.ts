"use server";

import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { findEnabledAgentsByCreatorId } from "@/mongodb/services/agent-service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const creatorId = url.searchParams.get("creatorId");
    if (!creatorId) {
      return createFailedApiResponse(
        { message: "Request params invalid" },
        400
      );
    }

    // Find agents
    const agents = await findEnabledAgentsByCreatorId(creatorId);

    // Return the agents
    return createSuccessApiResponse(agents);
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
