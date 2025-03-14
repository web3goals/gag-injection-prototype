import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    tokenFactory: Address | undefined;
    marketplace: Address | undefined;
  };
} = {
  injectiveTestnet: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a",
    marketplace: "0x7aba7ff10bc3db6fa82d6b23f5492a7f274101f2",
  },
};
