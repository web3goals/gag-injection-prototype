import { Chain } from "viem/chains";

export const injectiveTestnet: Chain = {
  id: 999,
  name: "Injective Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "INJ",
    symbol: "INJ",
  },
  rpcUrls: {
    default: { http: ["https://k8s.testnet.evmix.json-rpc.injective.network"] },
  },
  blockExplorers: {
    default: {
      name: "Injective Testnet Explorer",
      url: "https://k8s.testnet.evm.blockscout.injective.network",
    },
  },
  testnet: true,
};
