const fetch = require('node-fetch');
const FeedMe = require('feedme');
const parser = new FeedMe(true);

const logger = require('./logger');

// Fetch RSS feed and parse it
const fetchFeed = async (uri) => {
    try {
        const data = await fetch(uri);
        data.body.pipe(parser);

        return parser;
    } catch (err) {
        logger.error(`Error fetching feed from: ${uri}`);
        logger.error(err);
    }
}

module.exports = {
    fetchFeed
}
