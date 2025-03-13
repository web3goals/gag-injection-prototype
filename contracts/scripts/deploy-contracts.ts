import hre from "hardhat";
import { Hex } from "viem";
import TokenFactory from "../artifacts/contracts/TokenFactory.sol/TokenFactory.json";
import { injectiveTestnet } from "./data/chains";
import { CONTRACTS } from "./data/deployed-contracts";

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  const network = hre.network.name;

  // Deploy token factory contract
  if (!CONTRACTS[network].tokenFactory) {
    // Deploy contract on Injective Testnet
    let contractAddress = undefined;
    if (network === "injectiveTestnet") {
      console.log("Here");
      const [deployer] = await hre.viem.getWalletClients({
        chain: injectiveTestnet,
      });
      const walletClients = await hre.viem.getWalletClients({
        chain: injectiveTestnet,
      });
      const walletClient = walletClients[0];
      if (!walletClient) {
        throw new Error("No wallet client found");
      }
      const hash = await walletClient.deployContract({
        abi: TokenFactory.abi,
        bytecode: TokenFactory.bytecode as Hex,
        args: [deployer.account.address],
      });
      const publicClient = await hre.viem.getPublicClient({
        chain: injectiveTestnet,
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      contractAddress = receipt.contractAddress;
    }
    // Deploy contract on other networks
    else {
      const [deployer] = await hre.viem.getWalletClients();
      const contract = await hre.viem.deployContract("TokenFactory", [
        deployer.account.address,
      ]);
      contractAddress = contract.address;
    }

    console.log(`Contract 'TokenFactory' deployed to: ${contractAddress}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
