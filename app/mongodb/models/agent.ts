import { ObjectId } from "mongodb";

export class Agent {
  constructor(
    public creatorId: string,
    public creatorAddress: string,
    public createdDate: Date,
    public style: string,
    public network: string,
    public accounts: string[],
    public _id?: ObjectId
  ) {}
}
