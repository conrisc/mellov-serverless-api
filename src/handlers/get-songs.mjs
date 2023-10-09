import { getDB } from "../services/database.service.mjs";
import { translateSongItemDto } from "../translators/song-item.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getSongsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSongsHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let { skip = 0, limit = 10, title = '', sort = '' } = event.queryStringParameters || {};
    let { tags = [] } = event.multiValueQueryStringParameters || {};

    if (tags.length === 1 && tags[0].includes(',')) {
        tags = tags[0].split(',');
    }

    skip = parseInt(skip);
    limit = parseInt(limit);
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (tags && tags.length > 0) query.tags = { $in: tags };

    const sortSetting = {};
    switch (sort) {
        case 'title_asc':
            sortSetting.title = 1;
            break;
        case 'title_desc':
            sortSetting.title = -1;
            break;
        case 'added_date_asc':
            sortSetting.dateAdded = 1;
            break;
        case 'added_date_desc':
            sortSetting.dateAdded = -1;
            break;
        default:
            console.warn(`Unknown sort option ${sort}`);
            break;
    }

    let dtoResults = [];
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        if (sort !== 'random')
            dtoResults = await collection.find(query).sort(sortSetting).skip(skip).limit(limit).toArray();
        else
            dtoResults = await collection.aggregate([{ $match: query }, { $sample: { size: limit } }]).toArray();

        console.log(`Found ${dtoResults.length} songs`);
    } catch (error) {
        console.error(`Failed to get songs from database: ${error}`);
    }

    const results = dtoResults.map(translateSongItemDto);
    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(results)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
