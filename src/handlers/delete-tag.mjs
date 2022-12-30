import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const deleteTagHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`deleteTagHandler only accept DELETE method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'tags';

    let { tagId } = event.pathParameters || {};

    let response;
    try {
        const db = await getDB();
        deleteTagFromSongs(db, tagId); // TODO: Add separate try catch

        const collection = db.collection(collectionName);
        const deleteResult = await collection.findOneAndDelete({ _id: new ObjectId(tagId) });
        response = {
            statusCode: 204,
            headers: corsHeaders(),
        };
        console.log(`Tag deleted: ${deleteResult}`);
    } catch (error) {
        console.log(`Error while deleting the tag: ${error}`);
        response = {
            statusCode: 400,
            headers: corsHeaders(),
            body: 'Failed to delete the tag',
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}


async function deleteTagFromSongs(db, tagId) {
    const collection = db.collection('songs');
    // collection.updateMany({ tags: { $all: [tagId] } }).
    const updateResult = await collection.updateMany({}, {
        $pull: {
            tags: { $in : [tagId] }
        }
    })
    console.log(`Songs updated: ${updateResult}`);
}
