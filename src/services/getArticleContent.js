import read from 'node-readability';
import { isValidUrl, cleanHTML } from '../utils';
import logger from '../../lib/logger';

/**
 * Article Object
 *
 * @typedef {Object} Article Article Object, returned by node-readability
 * @property {String} content The article content of the web page. False if failed!
 * @property {String} title The article title of the web page.
 * @property {String} textBody A string containing all the text found on the page
 * @property {String} html The original html of the web page.
 * @property {String} document
 */

/**
 * Uses node-readability library to scrape web page
 * https://github.com/luin/readability
 *
 * @method getArticle
 * @param {String} url Valid URL
 * @returns {Promise.<Article>} Promise that returns an Article Content if resolved
 */
const getArticle = url => new Promise((resolve) => {
	if (!isValidUrl(url)) {
		logger.error(`[getArticle] Invalid URL provided ${url}.`);
		resolve();
	}

	read(url, (err, article) => {
		if (err) {
			logger.error(`[getArticle] Error getting article content for url: ${url}`, err);
			resolve();
		}

		resolve(article);
	});
});

// Gets Article Content for URL and sanitizes response HTML
const getArticleContent = async (url) => {
	const article = await getArticle(url);
	const { content } = article;

	if (content) {
		return cleanHTML(content);
	}

	return null;
};

export { getArticleContent };
