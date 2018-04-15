import Parser from 'rss-parser';
import { isValidUrl } from '../utils';
import logger from '../../config/logger';

const parser = new Parser();

/**
 * Feed Item
 *
 * @typedef {Object} FeedItem
 * @property {String} title
 * @property {String} link
 * @property {String} pubDate
 * @property {String} creator
 * @property {String} content
 * @property {String} contentSnippet
 * @property {String} guid
 * @property {String[]} categories
 * @property {String} isoDate
 */

/**
 * Uses rss-parser library to fetch RSS feeds for URL
 * https://github.com/bobby-brennan/rss-parser
 *
 * @method fetchFeed
 * @param {String} url Valid URL
 * @returns {(FeedItem[]|[])} Array of Feed Items or Empty Array
 */
const fetchFeed = async (url) => {
	try {
		if (!isValidUrl(url)) {
			throw new Error(`[fetchFeed] Invalid URL provided ${url}.`);
		}

		const feed = await parser.parseURL(url);

		return feed.items;
	} catch (err) {
		logger.error(`[fetchFeed] error for url: "${url}".`);
		logger.error('rss-parser Error Stack', err);

		return Promise.resolve(Array(0));
	}
};

export { fetchFeed };
