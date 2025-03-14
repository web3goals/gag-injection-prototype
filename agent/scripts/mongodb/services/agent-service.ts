import { Collection, ObjectId } from "mongodb";
import { mongoDBConfig } from "../../config/mongodb";
import clientPromise from "../client";
import { Agent } from "../models/agent";

export async function findEnabledAgents() {
  const collection = await getCollectionAgents();
  return await collection.find({ disabled: false }).toArray();
}

export async function findAgent(id: ObjectId): Promise<Agent | null> {
  const collection = await getCollectionAgents();
  const tokenIdea = await collection.findOne({ _id: id });
  return tokenIdea;
}

export async function updateAgent(params: {
  id: ObjectId;
  newPosts?: {
    token: string;
    hash: string;
    parentHash: string;
    createdDate: Date;
  }[];
}) {
  const collection = await getCollectionAgents();
  await collection.updateOne(
    { _id: params.id },
    {
      $set: {
        ...(params.newPosts && { posts: params.newPosts }),
      },
    }
  );
}

async function getCollectionAgents(): Promise<Collection<Agent>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Agent>(mongoDBConfig.collectionAgents);
}
