import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";
import { ItemCreated } from "../models/item-created.model.mjs";

export const addTagHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`addTagHandler only accept POST method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'tags';

    let response;
    let tagItem;
    try {
        tagItem = JSON.parse(event.body);
    } catch (error) {
        console.error(`Failed to parse body: ${error}`);

        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to parse body - invalid Tag object',
        };
    }

    if (tagItem) {
        try {
            const db = await getDB();
            const collection = db.collection(collectionName);

            const insertResult = await collection.insertOne(tagItem);
            response = {
                statusCode: 201,
                headers: corsHeaders(),
                body: JSON.stringify(new ItemCreated(insertResult.insertedId.toHexString())),
            };
        } catch (error) {
            console.log(`Error while inserting tag: ${error}`);
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to add the tag',
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
