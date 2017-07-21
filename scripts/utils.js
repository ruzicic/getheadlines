const fetch = require('node-fetch');
const FeedMe = require('feedme');
const parser = new FeedMe(true);

const logger = require('./logger');

// Fetch RSS feed, parse it and return JSON object
const fetchFeed = async (uri) => {
    try {
        await fetch(uri)
            .then(data => {
                data.body.pipe(parser);
                parser.on('end', () => {
                    logger.info(`Successfully fetched from ${uri}`);
                    return parser.done();
                });
            })
    } catch (err) {
        logger.error(`Error fetching feed from: ${uri}`);
        logger.error(err);
    }
}

module.exports = {
    fetchFeed
}
