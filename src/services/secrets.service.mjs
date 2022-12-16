// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "eu-central-1",
});

export async function resolveSecret(secretName) {
    let response;
    try {
        response = await client.send(
            new GetSecretValueCommand({
            SecretId: secretName,
            VersionStage: "AWSCURRENT",
        })
    );
    } catch (error) {
        console.error(`Failed to resolve secret ${secretName}`);
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    try {
        return JSON.parse(response.SecretString);
    } catch(e) {
        return response.SecretString;
    }
}
