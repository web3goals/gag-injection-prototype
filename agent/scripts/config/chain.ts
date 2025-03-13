import { Address, parseEther } from "viem";
import { injectiveTestnet } from "../chains/injectiveTestnet";

export const chainConfig = {
  chain: injectiveTestnet,
  contracts: {
    marketplace: "0xfe0aed5cbee89869ff505e10a5ebb75e9fc819d7" as Address,
  },
  marketplaceListTokenPrice: parseEther("0.001"),
};
