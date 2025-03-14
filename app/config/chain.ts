import { injectiveTestnet } from "@/chains/injectiveTestnet";
import { Address } from "viem";

export const chainConfig = {
  chain: injectiveTestnet,
  accounts: {
    agent: "0xAc0c6FA20a944Aa23db084438b9e32DA9524078a" as Address,
  },
  contracts: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a" as Address,
    marketplace: "0x17dc361d05e1a608194f508ffc4102717666779f" as Address,
    marketplaceCreationgBlock: "32545569",
  },
};
