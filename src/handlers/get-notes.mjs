import { getDB } from "../services/database.service.mjs";
import { translateNoteItemDto } from "../translators/note-item.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getNotesHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getNotesHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'notes';

    let { skip = 0, limit = 300 } = event.queryStringParameters || {};
    skip = parseInt(skip);
    limit = parseInt(limit);

    let dtoResults = [];
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        dtoResults = await collection.find({}).skip(skip).limit(limit).toArray();
        console.log(`Found ${dtoResults.length} notes`);
    } catch (error) {
        console.error(`Failed to get notes from database: ${error}`);
    }

    const results = dtoResults.map(translateNoteItemDto);
    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(results)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
