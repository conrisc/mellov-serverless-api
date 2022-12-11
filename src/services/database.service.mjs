import { MongoClient } from 'mongodb';

const dbCluster = process.env.DB_CLUSTER;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true });

export async function getDB() {
    await client.connect();
    console.log('Connected successfully to the database');
    const database = client.db();
    return database;
}
