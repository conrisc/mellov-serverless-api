import { MongoClient } from 'mongodb';
import { resolveSecret } from './secrets.service.mjs';

const dbCluster = process.env.DB_CLUSTER;
const dbCredentialsSecretName = process.env.DB_CREDENTIALS_SECRET_NAME;
let dbClient;

export async function getDB() {
    if (!dbClient) {
        const dbCredentials = await resolveSecret(dbCredentialsSecretName);
        const { username: dbUsername, password: dbPassword } = dbCredentials;
        const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}?retryWrites=true&w=majority`;
        dbClient = new MongoClient(uri, { useUnifiedTopology: true });

        await dbClient.connect();
        console.log('Connected successfully to the database');
    } else {
        console.log('Reusing existing db connection');
    }

    const database = dbClient.db();
    return database;
}
