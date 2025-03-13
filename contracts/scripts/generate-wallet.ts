import { randomBytes } from "crypto";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

async function main() {
  console.log("👟 Start script 'generate-wallet'");

  const privateKey = randomBytes(32);
  const account = privateKeyToAccount(`0x${privateKey.toString("hex")}` as Hex);
  console.log("🔑 Private key:", privateKey.toString("hex"));
  console.log("📫 Address:", account.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
