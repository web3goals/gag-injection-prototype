import { mongoDBConfig } from "@/config/mongodb";
import { Collection, ObjectId } from "mongodb";
import clientPromise from "../client";
import { Agent } from "../models/agent";

export async function findEnabledAgentsByCreatorId(
  creatorId: string
): Promise<Agent[]> {
  const collection = await getCollectionAgents();
  return await collection
    .find({ creatorId: creatorId, disabled: false })
    .toArray();
}

export async function insertAgent(agent: Agent): Promise<ObjectId> {
  const collection = await getCollectionAgents();
  const insertOneResult = await collection.insertOne(agent);
  return insertOneResult.insertedId;
}

async function getCollectionAgents(): Promise<Collection<Agent>> {
  const client = await clientPromise;
  const db = client.db(mongoDBConfig.database);
  return db.collection<Agent>(mongoDBConfig.collectionAgents);
}
