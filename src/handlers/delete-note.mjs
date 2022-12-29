import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const deleteNoteHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`deleteNoteHandler only accept DELETE method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'notes';

    let { noteId } = event.pathParameters || {};

    let response;
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);

        const deleteResult = await collection.findOneAndDelete({ _id: new ObjectId(noteId) });
        response = {
            statusCode: 204,
            headers: corsHeaders(),
        };
        console.log(`Note deleted: ${deleteResult}`);
    } catch (error) {
        console.log(`Error while deleting the note: ${error}`);
        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to delete the note',
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
