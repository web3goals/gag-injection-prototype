import {
  Address,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  parseEventLogs,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { marketplaceAbi } from "../abi/marketplace";
import { tokenAbi } from "../abi/token";
import { chainConfig } from "../config/chain";

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

export async function createToken(
  tokenAddress: Address,
  tokenUri: string
): Promise<bigint> {
  console.log("Creating token...");
  const { request } = await publicClient.simulateContract({
    account: account,
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "safeMint",
    args: [account.address, tokenUri],
  });
  const hash = await walletClient.writeContract(request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const logs = parseEventLogs({
    abi: tokenAbi,
    eventName: "Transfer",
    logs: receipt.logs,
  });
  return logs[0].args.tokenId;
}

export async function listToken(
  beneficiary: Address,
  tokenAddress: Address,
  tokenId: bigint,
  price: bigint
): Promise<bigint> {
  console.log("Listing token...");
  // Approve transfer for the token
  const { request: approveRequest } = await publicClient.simulateContract({
    account: account,
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "approve",
    args: [chainConfig.contracts.marketplace, tokenId],
  });
  const approveHash = await walletClient.writeContract(approveRequest);
  await publicClient.waitForTransactionReceipt({
    hash: approveHash,
  });
  // List the token
  const { request: listRequest } = await publicClient.simulateContract({
    account: account,
    address: chainConfig.contracts.marketplace,
    abi: marketplaceAbi,
    functionName: "list",
    args: [beneficiary, tokenAddress, tokenId, price],
  });
  const listHash = await walletClient.writeContract(listRequest);
  const listReceipt = await publicClient.waitForTransactionReceipt({
    hash: listHash,
  });
  const listLogs = parseEventLogs({
    abi: marketplaceAbi,
    eventName: "Listed",
    logs: listReceipt.logs,
  });
  return listLogs[0].args.listingId;
}
