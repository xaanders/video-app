import { MongoClient } from "mongodb";

export const ConnectToDatabase = async (url) => {
    const dbClient = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = dbClient.db();

    return {db, dbClient};
  }
  
