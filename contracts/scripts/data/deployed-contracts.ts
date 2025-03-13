import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    tokenFactory: Address | undefined;
  };
} = {
  injectiveTestnet: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a",
  },
};
