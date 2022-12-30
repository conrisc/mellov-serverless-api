import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const deleteSongHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`deleteSongHandler only accept DELETE method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let { songId } = event.pathParameters || {};

    let response;
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);

        const deleteResult = await collection.findOneAndDelete({ _id: new ObjectId(songId) });
        response = {
            statusCode: 204,
            headers: corsHeaders(),
        };
        console.log(`Song deleted: ${deleteResult}`);
    } catch (error) {
        console.log(`Error while deleting the song: ${error}`);
        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to delete the song',
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
