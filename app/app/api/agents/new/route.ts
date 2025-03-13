"use server";

import { chainConfig } from "@/config/chain";
import { tokenFactoryAbi } from "@/contracts/abi/tokenFactory";
import { createFailedApiResponse, createSuccessApiResponse } from "@/lib/api";
import { errorToString } from "@/lib/converters";
import { Agent } from "@/mongodb/models/agent";
import { insertAgent } from "@/mongodb/services/agent-service";
import { NextRequest } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  parseEventLogs,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

const requestBodySchema = z.object({
  creatorId: z.string().min(1),
  creatorAddress: z.string().min(1),
  style: z.string().min(1),
  network: z.string().min(1),
  account: z.string().min(1),
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

    // Deploy a token contract
    const account = privateKeyToAccount(process.env.AGENT_PRIVATE_KEY as Hex);
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(),
    });
    const walletClient = createWalletClient({
      account: account,
      chain: chainConfig.chain,
      transport: http(),
    });
    const { request: createRequest } = await publicClient.simulateContract({
      account: account,
      address: chainConfig.contracts.tokenFactory,
      abi: tokenFactoryAbi,
      functionName: "createToken",
      args: ["Injection Gag Token", "IGT"],
    });
    const hash = await walletClient.writeContract(createRequest);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const logs = parseEventLogs({
      abi: tokenFactoryAbi,
      eventName: "TokenCreated",
      logs: receipt.logs,
    });
    const token = logs[0].args.token;

    // Create an agent
    const agent: Agent = {
      creatorId: bodyParseResult.data.creatorId,
      creatorAddress: bodyParseResult.data.creatorAddress,
      createdDate: new Date(),
      style: bodyParseResult.data.style,
      network: bodyParseResult.data.network,
      account: bodyParseResult.data.account,
      tokenAddress: token,
      posts: [],
      disabled: false,
    };

    const agentId = await insertAgent(agent);
    agent._id = agentId;

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
