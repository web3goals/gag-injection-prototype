import { pinataConfig } from "@/config/pinata";
import { User } from "@privy-io/react-auth";
import { AxiosError } from "axios";

/**
 * Converts "0x4306D7a2c265D2cb72Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 */
export function addressToShortAddress(
  address: string | undefined
): string | undefined {
  let shortAddress = address;
  if (address && address.length > 10) {
    shortAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }
  return shortAddress?.toLowerCase();
}

export function errorToString(error: unknown): string {
  let message = JSON.stringify(error, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
  if (error instanceof Error) {
    message = error.message;
  }
  if (error instanceof AxiosError) {
    message = JSON.stringify({
      status: error.response?.status,
      data: error.response?.data,
    });
  }
  return message;
}

export function privyUserToEmail(user: User | null): string | undefined {
  return user?.email?.address || user?.google?.email;
}

export function ipfsUriToHttp(ipfsUri: string): string {
  return ipfsUri.replace("ipfs://", `https://${pinataConfig.gateway}/ipfs/`);
}
