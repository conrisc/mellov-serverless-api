import { getDB } from "../services/database.service.mjs";

export const getSongsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getSongsItemHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);
    const collectionName = 'songs';

    let results = [];
    const skip = 0;
    const limit = 10;
    const data = {};
    // if (id) data._id = new ObjectId(id);
    // if (title) data.title = { $regex: title, $options: 'i' };
    // if (tags && tags.length > 0) data.tags = { $in: tags };

    const sortData = {};
    // switch(sort) {
    //     case 'title_asc':
    //         sortData.title = 1;
    //         break;
    //     case 'title_desc':
    //         sortData.title = -1;
    //         break;
    //     case 'addedDate_asc':
    //         sortData.dateAdded = 1;
    //         break;
    //     case 'addedDate_desc':
    //         sortData.dateAdded = -1;
    //         break;
    // }

    try {
        const db = await getDB();
        const collection = db.collection(collectionName);
        // if (sort !== 'random')
        results = await collection.find(data).sort(sortData).skip(skip).limit(limit).toArray();
        // else
        //     collection.aggregate([{ $match: data }, { $sample: {size: limit} }]).toArray(log);
        console.log(`Found ${results.length} songs`);
    } catch (error) {
        console.error(`Failed to get songs from database: ${error}`);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify({ items: results })
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
