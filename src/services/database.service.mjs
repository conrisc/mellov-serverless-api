import { MongoClient } from 'mongodb';
import { resolveParameters } from './parameter-store.service.mjs';

const dbCluster = process.env.DB_CLUSTER;
const dbUsernameSsmParameter = process.env.DB_USERNAME_SSM_PARAMETER;
const dbPasswordSsmParameter = process.env.DB_PASSWORD_SSM_PARAMETER;
let dbClient;

export async function getDB() {
    if (!dbClient) {
        const dbCredentials = await resolveParameters([
            dbUsernameSsmParameter,
            dbPasswordSsmParameter,
        ], true);
        const dbUsername = dbCredentials[dbUsernameSsmParameter];
        const dbPassword = dbCredentials[dbPasswordSsmParameter];
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
