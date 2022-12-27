import { getDB } from "../services/database.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getSongsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSongsItemHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let { skip = 0, limit = 10, title = '', sort = '' } = event.queryStringParameters;
    const { tags = [] } = event.multiValueQueryStringParameters;

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

    let results = [];
    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        if (sort !== 'random')
            results = await collection.find(query).sort(sortSetting).skip(skip).limit(limit).toArray();
        else
            collection.aggregate([{ $match: data }, { $sample: {size: limit} }]).toArray(log);

        console.log(`Found ${results.length} songs`);
    } catch (error) {
        console.error(`Failed to get songs from database: ${error}`);
    }

    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(results)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
