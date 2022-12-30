import { ObjectId } from 'mongodb';
import { getDB } from "../services/database.service.mjs";
import { translateSongItemDto } from '../translators/song-item.mjs';
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const updateSongHandler = async (event) => {
    if (event.httpMethod !== 'PUT') {
        throw new Error(`updateSongHandler only accept PUT method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let { songId } = event.pathParameters || {};
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

    if (songItem.id !== songId)
        console.warn(`Path parameter nodeId=${songId} is not equal to the songId=${songItem.id} in the request's body`);

    if (songId && songItem) {
        const db = await getDB();

        const songTagIds = songItem.tags.map(tag => new ObjectId(tag));
        const tagsCollection = db.collection('tags');
        let relatedTagItems = [];
        try {
            relatedTagItems = await tagsCollection.find({ _id: { $in: songTagIds } }).toArray();
        } catch (error) {
            console.error(`Failed to get tags ${error}`); // TODO: Prevent from updating the song
        }

        const tagIds = relatedTagItems.map(tagItem => tagItem._id.toHexString());
        const songsCollection = db.collection(collectionName);
        const songUpdatePart = { title: songItem.title, url: songItem.url, tags: tagIds };

        let updateResult;
        try {
            updateResult = await songsCollection.findOneAndUpdate(
                { _id: new ObjectId(songItem.id) },
                { $set: songUpdatePart },
                { returnOriginal: false }
            );
        } catch (error) {
            console.log(`Error while updating the song: ${error}`);
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to update the song',
            };
        }


        if (updateResult?.ok === 1) {
            const updatedSong = translateSongItemDto({
                ...updateResult.value,
                ...songUpdatePart
            });	// because for some reason result.value is not returning updated item, even though returnOriginal is false
            console.log('Song updated, updated songItem:', updatedSong);
            response = {
                statusCode: 200,
                headers: corsHeaders(),
                body: JSON.stringify(updatedSong)
            };
        }
        else {
            response = {
                statusCode: 400,
                headers: corsHeaders(),
                body: 'Failed to update the song - there is no such song',
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

