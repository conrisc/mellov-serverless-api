import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const updateNoteHandler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`updateNoteHandler only accept PUT method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'notes';


    let { noteId } = event.pathParameters || {};
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

    if (noteItem.id !== noteId)
        console.warn(`Path parameter nodeId=${noteId} is not equal to the noteId=${noteItem.id} in the request's body`);


    if (noteId && noteItem) {
        try {
            const db = await getDB();
            const collection = db.collection(collectionName);

			await collection.updateOne({ _id: new ObjectId(noteItem.id) }, { $set: { text: noteItem.text }});
            console.log('Note updated');
            response = {
                statusCode: 204,
                headers: corsHeaders(),
            };
        } catch (error) {
            console.log(`Error while updating the note: ${error}`);
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to update the note',
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
