import https from 'https';

export function scrape(url) {
	console.log('Scraping url: ', url);
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            res.setEncoding('utf8');
            let body = '';

            res.on('data', data => {
                body += data;
            });

            res.on('end', () => {
                console.log(body.length);
                resolve(body);
            })
        });
    });
}

// scrape('https://www.youtube.com/results?search_query=eminem&sp=EgIQAQ%253D%253D')
//     .then(res => {
//         console.log(res);
//     })
