import hre from "hardhat";
import { Hex } from "viem";
import TokenFactory from "../artifacts/contracts/TokenFactory.sol/TokenFactory.json";
import { injectiveTestnet } from "./data/chains";
import { CONTRACTS } from "./data/deployed-contracts";

async function deployContracts() {
  const network = hre.network.name;
  const [deployer] = await hre.viem.getWalletClients();

  if (!CONTRACTS[network].tokenFactory) {
    const contract = await hre.viem.deployContract("TokenFactory", [
      deployer.account.address,
    ]);
    console.log(`Contract 'TokenFactory' deployed to: ${contract.address}`);
  }
}

async function deployInjectiveTestnetContracts() {
  const network = hre.network.name;
  const publicClient = await hre.viem.getPublicClient({
    chain: injectiveTestnet,
  });
  const [deployer] = await hre.viem.getWalletClients({
    chain: injectiveTestnet,
  });

  if (!CONTRACTS[network].tokenFactory) {
    const hash = await deployer.deployContract({
      abi: TokenFactory.abi,
      bytecode: TokenFactory.bytecode as Hex,
      args: [deployer.account.address],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(
      `Contract 'TokenFactory' deployed to: ${receipt.contractAddress}`
    );
  }
}

async function main() {
  console.log("👟 Start script 'deploy-contracts'");

  if (hre.network.name === "injectiveTestnet") {
    deployInjectiveTestnetContracts();
  } else {
    deployContracts();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
