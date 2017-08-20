/**
 * For testing only
 */
const read = require('node-readability');
const {logger} = require('./logger');
const {fetchFeed, getArticleContent} = require('./utils');
const {cleanHTML} = require('./helpers');

const tryUrl = async ctx => {
    const {url} = ctx.query;
    let jsonData;

    try {
        jsonData = await fetchFeed(url);

        if (!jsonData) throw Error('jsonData empty for some reason');

        const articleContent = await getArticleContent(jsonData.feed.entries[0].link);

        ctx.body = {
            msg: 'Showing only 1st article',
            requestedUrl: url,
            length: jsonData.feed.entries.length,
            articles: jsonData.feed.entries[0],
            firstArticleContent: articleContent,
            cleanedContent: cleanHTML(articleContent)
        }
    } catch (err) {
        logger.info(`tryUrl ${url} failed`);
        logger.info(err);

        ctx.response.status = 400;
        ctx.body = {
            error: 'BAD REQUEST',
            message: err
        }
    }
}

module.exports = {
    tryUrl
};
