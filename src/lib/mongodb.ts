import { MongoClient } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGO_DB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri: any = process.env.NEXT_PUBLIC_MONGO_DB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the MongoClient instance across hot reloads
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, avoid using a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
