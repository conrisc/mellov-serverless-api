import { scrape } from "../services/scraper.service.mjs";
import { corsHeaders } from "../utils/cors-headers.util.mjs";

export const getYtItemsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getYtItemsHandler only accept GET method, you tried: ${event.httpMethod}`);
    }

    console.info('received:', event);

    let { title = '', limit = 50 } = event.queryStringParameters || {};
    limit = parseInt(limit);


	const ytSearchUrl = `https://www.youtube.com/results?search_query=${title}&sp=EgIQAQ%253D%253D`;

    let ytItems = [];
    try {
        const scrapeResult = await scrape(ytSearchUrl);
        ytItems = createYtItems(scrapeResult, limit);
    } catch (error) {
        console.error(`Failed to get yt items: ${error}`);
    }

    const response = {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify(ytItems)
    };

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

function createYtItems(rawHtml, limit) {
    let resultsContainer = rawHtml.match(/ytInitialData\s=\s(.*?);<\/sc/)[1];
    let ytItems = [];
    try {
        const parsed = JSON.parse(resultsContainer);
        const videos = parsed.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        ytItems = videos.map(vid => {
            return vid.videoRenderer && {
                videoId: vid.videoRenderer.videoId,
                title: vid.videoRenderer.title.runs[0].text,
                thumbnailUrl: vid.videoRenderer.thumbnail.thumbnails[0].url
            }
        }).filter(ytItem => !!ytItem).slice(0, limit);
    } catch (error) {
        console.error(`Unable to parse results to JSON: ${error.message}`);
    }

    return ytItems;
}
