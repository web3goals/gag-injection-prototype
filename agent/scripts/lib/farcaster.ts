import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import {
  CastWithInteractions,
  PostCastResponse,
} from "@neynar/nodejs-sdk/build/api";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY as string,
});

const client = new NeynarAPIClient(config);

export async function getLatestCast(
  username: string
): Promise<CastWithInteractions> {
  console.log("Getting latest cast...");
  const userResponse = await client.lookupUserByUsername({ username });
  const feedResponse = await client.fetchCastsForUser({
    fid: userResponse.user.fid,
    limit: 1,
  });
  return feedResponse.casts[0];
}

export async function publishReplyCast(
  parentCastHash: string,
  text: string,
  image: string
): Promise<PostCastResponse> {
  console.log("Publishing reply cast...");
  return await client.publishCast({
    signerUuid: process.env.AGENT_SIGNER_UUID as string,
    text: text,
    embeds: [{ url: image }],
    parent: parentCastHash,
  });
}
