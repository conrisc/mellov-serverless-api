import { getDB } from "../services/database.service.mjs";
import { translateTagItemDto } from "../translators/tag-item.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getTagsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getTagsHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'tags';

    let { skip = 0, limit = 300 } = event.queryStringParameters || {};
    skip = parseInt(skip);
    limit = parseInt(limit);

    let dtoResults = [];
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        dtoResults = await collection.find({}).skip(skip).limit(limit).toArray();
        console.log(`Found ${dtoResults.length} tags`);
    } catch (error) {
        console.error(`Failed to get tags from database: ${error}`);
    }

    const results = dtoResults.map(translateTagItemDto);
    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(results)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
