import read from 'node-readability';
// import scrapeIt from 'scrape-it';
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
const getArticle = url => new Promise((resolve, reject) => {
	if (!isValidUrl(url)) {
		// logger.error(`[getArticle] Invalid URL provided ${url}.`);
		reject(new Error(`[getArticle] Invalid URL provided ${url}.`));
	}

	read(url, (err, article) => {
		if (err) {
			logger.error(`[getArticle] Error getting article content for url: ${url}`);
			reject(err);
		}

		resolve(article);
	});
});

// Gets Article Content for URL and sanitizes response HTML
const getArticleContent = async (url) => {
	try {
		const article = await getArticle(url);

		// In case of error article.content will be false
		if (!article || !article.content) {
			return null;
		}

		return cleanHTML(article.content);
	} catch (err) {
		logger.error(`[getArticleContent] Error ${url}`, err);
		return null;
	}

	// TODO: Try another tool if first one failed?
	// or make a map which tool for which provider? save in db?
	// const test = await scrapeIt(url);
	// return test.data;
};

export { getArticleContent };
