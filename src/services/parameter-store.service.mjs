// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import {
    GetParametersCommand,
    SSMClient
} from "@aws-sdk/client-ssm";

const client = new SSMClient({
  region: "eu-central-1",
});

export async function resolveParameters(paramNames, withDecryption) {
    console.log(`Retrieving ${paramNames.length} ssm parameters: ${paramNames.join(', ')}. With decryption: ${withDecryption}`);

    const command = new GetParametersCommand({
        Names: paramNames,
        WithDecryption: withDecryption
    });

    let response;
    try {
        response = await client.send(command);
    } catch (error) {
        console.error(`Failed to get parameters: ${paramNames.join(', ')}`);
        throw error;
    }

    console.log(`Retrieved ${response.Parameters.length} ssm parameters.`)

    const parametersMap = response.Parameters.reduce((acc, paramItem) => {
        const valueForLogs = paramItem.Type === 'SecureString' ? '<hidden>' : paramItem.Name;
        console.log(`[PARAMETER] ${paramItem.Name}: ${valueForLogs}`);

        acc[paramItem.Name] = paramItem.Value;

        return acc;
    }, {});

    // WARNING: Do not log response result or parametersMap to avoid revealing secure strings

    return parametersMap;
}
