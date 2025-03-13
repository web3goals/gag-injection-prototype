import { injectiveTestnet } from "@/chains/injectiveTestnet";
import { Address } from "viem";

export const chainConfig = {
  chain: injectiveTestnet,
  contracts: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a" as Address,
  },
};
