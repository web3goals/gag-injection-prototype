"use server";

import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { updateAgent } from "@/mongodb/services/agent-service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { z } from "zod";

const requestBodySchema = z.object({
  id: z.string().min(1),
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

    // Update the agent
    await updateAgent({
      id: new ObjectId(bodyParseResult.data.id),
      disabled: true,
    });

    // Return
    return createSuccessApiResponse("Fired");
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
