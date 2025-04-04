import { PinataSDK } from "pinata";
import { pinataConfig } from "../config/pinata";
import { logger } from "./logger";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: pinataConfig.gateway,
});

export async function uploadBase64String(
  base64String: string
): Promise<{ ipfsUrl: string; httpUrl: string }> {
  logger.info("Uploading Base64 string...");
  const upload = await pinata.upload.public.base64(base64String);
  const ipfsUrl = `ipfs://${upload.cid}`;
  return {
    ipfsUrl: ipfsUrl,
    httpUrl: await pinata.gateways.public.convert(ipfsUrl),
  };
}

export async function uploadJson(json: object): Promise<{
  ipfsUrl: string;
  httpUrl: string;
}> {
  logger.info("Uploading file...");
  const upload = await pinata.upload.public.json(json);
  const ipfsUrl = `ipfs://${upload.cid}`;
  return {
    ipfsUrl: ipfsUrl,
    httpUrl: await pinata.gateways.public.convert(ipfsUrl),
  };
}
