import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";
import { ItemCreated } from "../models/item-created.model.mjs";

export const addSongHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`addSongHandler only accept POST method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let response;
    let songItem;
    try {
        songItem = JSON.parse(event.body);
    } catch (error) {
        console.error(`Failed to parse body: ${error}`);

        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to parse body - invalid Song object',
        };
    }

    if (songItem) {
        try {
            const db = await getDB();
            const collection = db.collection(collectionName);

            const insertResult = await collection.insertOne(songItem);
            response = {
                statusCode: 201,
                headers: corsHeaders(),
                body: JSON.stringify(new ItemCreated(insertResult.insertedId.toHexString())),
            };
        } catch (error) {
            console.log(`Error while inserting song: ${error}`);
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to add the song',
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
