import { PinataSDK } from "pinata";

const pinataGateway = "yellow-mute-echidna-168.mypinata.cloud";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATE_JWT,
  pinataGateway: pinataGateway,
});

export async function uploadBase64String(
  base64String: string
): Promise<string> {
  console.log("Uploading Base64 string...");
  const upload = await pinata.upload.public.base64(base64String);
  return `https://${pinataGateway}/ipfs/${upload.cid}`;
}
