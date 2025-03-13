import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import {
  CastWithInteractions,
  PostCastResponse,
} from "@neynar/nodejs-sdk/build/api";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY as string,
});

const client = new NeynarAPIClient(config);

export async function getLatestCasts(
  username: string,
  limit: number
): Promise<CastWithInteractions[]> {
  console.log("Getting latest casts...");
  const userResponse = await client.lookupUserByUsername({ username });
  const feedResponse = await client.fetchCastsForUser({
    fid: userResponse.user.fid,
    limit: limit,
  });
  return feedResponse.casts;
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
