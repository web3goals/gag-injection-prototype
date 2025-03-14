import { injectiveTestnet } from "@/chains/injectiveTestnet";
import { Address } from "viem";

export const chainConfig = {
  chain: injectiveTestnet,
  contracts: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a" as Address,
    marketplace: "0x7aba7ff10bc3db6fa82d6b23f5492a7f274101f2" as Address,
  },
};
