import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("Marketplace", function () {
  async function initFixture() {
    // Get signers
    const [deployer, agent, userOne, userTwo] =
      await hre.viem.getWalletClients();

    // Deploy contracts
    const tokenFactoryContract = await hre.viem.deployContract("TokenFactory", [
      agent.account.address,
    ]);
    const marketplaceContract = await hre.viem.deployContract(
      "Marketplace",
      []
    );

    return {
      deployer,
      agent,
      userOne,
      userTwo,
      tokenFactoryContract,
      marketplaceContract,
    };
  }

  it("Should list a token", async function () {
    const {
      agent,
      userOne,
      userTwo,
      tokenFactoryContract,
      marketplaceContract,
    } = await loadFixture(initFixture);

    // Save user one balance before test
    const publicClient = await hre.viem.getPublicClient();
    const userOneBalanceBefore = await publicClient.getBalance({
      address: userOne.account.address,
    });

    // Create a token contract
    const hash = await tokenFactoryContract.write.createToken(
      ["Gag Injection Token", "MTK"],
      {
        account: agent.account,
      }
    );
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const events = await tokenFactoryContract.getEvents.TokenCreated(receipt);
    expect(events.length).to.equal(1);
    const token = events[0].args.token;
    const tokenContract = await hre.viem.getContractAt(
      "Token",
      token as `0x${string}`
    );

    // Mint a token by agent
    await expect(
      tokenContract.write.safeMint([agent.account.address, "ipfs://42"], {
        account: agent.account,
      })
    ).to.be.fulfilled;

    // List the token
    await expect(
      tokenContract.write.approve([marketplaceContract.address, 0n], {
        account: agent.account,
      })
    ).to.be.fulfilled;
    await expect(
      marketplaceContract.write.list(
        [userOne.account.address, tokenContract.address, 0n, parseEther("5")],
        { account: agent.account }
      )
    ).to.be.fulfilled;
    expect((await tokenContract.read.ownerOf([0n])).toLowerCase()).to.equal(
      marketplaceContract.address.toLowerCase()
    );

    // Buy the token by user two
    await expect(
      marketplaceContract.write.buy([1n], {
        account: userTwo.account,
        value: parseEther("5"),
      })
    ).to.fulfilled;
    expect((await tokenContract.read.ownerOf([0n])).toLowerCase()).to.equal(
      userTwo.account.address.toLowerCase()
    );

    // Check user one balance after test
    const userOneBalanceAfter = await publicClient.getBalance({
      address: userOne.account.address,
    });
    expect(userOneBalanceAfter).to.equal(
      userOneBalanceBefore + parseEther("5")
    );
  });
});
