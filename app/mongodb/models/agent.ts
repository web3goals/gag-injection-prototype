import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public creatorId: string,
    public creatorAddress: string,
    public createdDate: Date,
    public style: string,
    public network: string,
    public account: string,
    public tokenAddress: string,
    public posts: { url: string; createdDate: Date }[],
    public disabled: boolean,
    public _id?: ObjectId
  ) {}
}
