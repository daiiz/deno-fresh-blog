// https://deno.land/x/mongo@v0.30.1
import { MongoClient } from "mongo";
import "dotenv/load.ts";

// TODO: 切り出す
interface PimentoBlogPageSchema {
  gcsObjectName: string;
  title: string;
  publishedAt: string;
}

// 環境変数からMongoDBのURIなどを取得する
const myMongoUri = Deno.env.get("MY_MONGODB_URI");
const dbName = Deno.env.get("DB_NAME");

if (!myMongoUri || !dbName || !myMongoUri.startsWith("mongodb+srv://")) {
  throw new Error("MY_MONGODB_URI is not set or invalid");
}

const client = new MongoClient();
let pimentoBlogPages = null;

const connectMongo = async () => {
  await client.connect(myMongoUri);
  const db = client.database(dbName);

  pimentoBlogPages = db.collection<PimentoBlogPageSchema>("pimentoblogpages");
};

export const findRecentArticles = async () => {
  const cursor = pimentoBlogPages.find({});
  cursor.sort({ publishedAt: -1 }).limit(10);

  const articles = await cursor.toArray();
  return articles;
};

connectMongo();
