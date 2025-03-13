import { Address } from "viem";

export const CONTRACTS: {
  [key: string]: {
    tokenFactory: Address | undefined;
    marketplace: Address | undefined;
  };
} = {
  injectiveTestnet: {
    tokenFactory: "0x02008a8dbc938bd7930bf370617065b6b0c1221a",
    marketplace: "0xfe0aed5cbee89869ff505e10a5ebb75e9fc819d7",
  },
};
