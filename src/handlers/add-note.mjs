import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const addNoteHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`addNoteHandler only accept POST method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'notes';

    let response;
    let noteItem;
    try {
        noteItem = JSON.parse(event.body);
    } catch (error) {
        console.error(`Failed to parse body: ${error}`);

        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to parse body - invalid Note object',
        };
    }

    if (noteItem) {
        try {
            const db = await getDB();
            const collection = db.collection(collectionName);

            const insertResult = await collection.insertOne(noteItem);
            response = {
                statusCode: 201,
                headers: corsHeaders(),
                body: insertResult.insertedId.toHexString()
            };
        } catch (error) {
            console.log(`Error while inserting note: ${error}`);
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to add the note',
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
