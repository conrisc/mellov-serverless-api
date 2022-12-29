import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { translateNoteItemDto } from "../translators/note-item.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getNoteHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getNoteHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'notes';

    let { noteId } = event.pathParameters || {};

    let dtoResult = null;
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        dtoResult = await collection.findOne({ _id: new ObjectId(noteId) });
        if (dtoResult) console.log(`Found note with id ${noteId}`);
        else console.log(`Note with id ${noteId} doesn't exist`)
    } catch (error) {
        console.error(`Failed to get note from database: ${error}`);
    }

    const result = dtoResult ? translateNoteItemDto(dtoResult) : null;
    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(result)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
