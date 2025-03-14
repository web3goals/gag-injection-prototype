import { Address, parseEther } from "viem";
import { injectiveTestnet } from "../chains/injectiveTestnet";

export const chainConfig = {
  chain: injectiveTestnet,
  contracts: {
    marketplace: "0x7aba7ff10bc3db6fa82d6b23f5492a7f274101f2" as Address,
  },
  marketplaceListTokenPrice: parseEther("0.001"),
};
