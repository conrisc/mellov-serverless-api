import { MongoClient } from 'mongodb';
import { resolveSecret } from './secrets.service.mjs';

const dbCluster = process.env.DB_CLUSTER;
const dbCredentialsSecretName = process.env.DB_CREDENTIALS_SECRET_NAME;

// TODO: Resolve secrets once and connect to db once
export async function getDB() {
    const dbCredentials = await resolveSecret(dbCredentialsSecretName);
    const {
        username: dbUsername,
        password: dbPassword,
    } = dbCredentials;
    const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    await client.connect();
    console.log('Connected successfully to the database');
    const database = client.db();
    return database;
}
