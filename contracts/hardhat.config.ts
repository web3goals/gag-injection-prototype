import "@nomicfoundation/hardhat-toolbox-viem";
import type { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    },
  },
  networks: {
    injectiveTestnet: {
      url: "https://k8s.testnet.evmix.json-rpc.injective.network",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: {
      injectiveTestnet: "empty",
    },
    customChains: [
      {
        network: "injectiveTestnet",
        chainId: 999,
        urls: {
          apiURL:
            "https://k8s.testnet.evm.blockscout.api.injective.network/api",
          browserURL: "https://k8s.testnet.evm.blockscout.injective.network",
        },
      },
    ],
  },
};

export default config;
