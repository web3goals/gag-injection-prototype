import { ObjectId } from "mongodb";
import { Address } from "viem";

export class Agent {
  constructor(
    public creatorId: string,
    public creatorAddress: Address,
    public createdDate: Date,
    public style: "KIND_SWEET" | "PROVOCATIVE_SARCASTIC",
    public network: "WARPCAST",
    public account: string,
    public tokenAddress: Address,
    public posts: { url: string; createdDate: Date }[],
    public disabled: boolean,
    public _id?: ObjectId
  ) {}
}
