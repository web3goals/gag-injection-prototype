import { Address, parseEther } from "viem";
import { injectiveTestnet } from "../chains/injectiveTestnet";

export const chainConfig = {
  chain: injectiveTestnet,
  contracts: {
    marketplace: "0x17dc361d05e1a608194f508ffc4102717666779f" as Address,
  },
  marketplaceListTokenPrice: parseEther("0.001"),
};
