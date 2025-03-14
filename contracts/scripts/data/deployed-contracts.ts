import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    tokenFactory: Address | undefined;
    marketplace: Address | undefined;
  };
} = {
  injectiveTestnet: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a",
    marketplace: "0x17dc361d05e1a608194f508ffc4102717666779f",
  },
};
