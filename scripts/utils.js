const parser = require('rss-parser');
const read = require('node-readability');

const {logger} = require('./logger');
const {cleanHTML} = require('./helpers');

const fetchFeed = url => {
	if (!url) {
		logger.error(`URL not provided to rss-parser.`);
		process.exit(1);
	}

	return new Promise((resolve, reject) => {
		parser.parseURL(url, (err, parsed) => {
			if (err) {
				logger.error(`Error fetching feed ${url}`);
				logger.error(err);

				reject(err);
			}

			resolve(parsed);
		});
	});
};

// Call getArticleContent for list/array of feeds
// Add article content to existing object
const getFullArticles = async feeds => {
	if (!feeds || feeds.length === 0) {
		return new Array(0);
	}

	let feedsWithArticle = [];
	for (let feed of feeds) {
		const {title, description, link, pubDate, author, timeUTC} = feed;
		const content = await getArticleContent(link);

		feedsWithArticle.push({
			title,
			description,
			link,
			pubDate,
			author,
			timeUTC,
			content: cleanHTML(content)
		});
	}

	return feedsWithArticle;
}

// Fetch article content from url
const getArticleContent = url => {
	return new Promise((resolve, reject) => {
		// Do not throw error if bad url was provided
		if (!url) {
			logger.error('URL not provided to node-readability.');
			resolve(null);
		}

		read(url, (err, article, meta) => {
			if (err) {
				logger.error(`Error getting article content for url: ${url}`);
				logger.error(err);

				// reject(err);
				resolve(null);
			}

			resolve(article.content);
		});
	});
}

/**
 * Validate and map rss-parser output to Object to save in Firebase database
 * @param {Object} data rss-parser output data example: https://github.com/bobby-brennan/rss-parser/blob/master/test/output/reddit.json
 */
const prepareFeedsForSave = feeds => {
	if (!feeds || feeds.length === 0) {
		return new Array(0);
	}

	let prepared = [];
	feeds.forEach(feed => {
		// A string representing the given date using the UTC time zone.
		// Example: "Sun, 20 Aug 2017 07:06:14 GMT"
		const timeUTC = new Date(feed.pubDate).toUTCString();

		prepared.push({
			title: feed.title,
			// The item synopsis. The contentSnippet field strips out HTML tags and unescapes HTML entities
			description: feed.contentSnippet || feed.content,
			// The URL of the item.
			link: feed.link,
			// Indicates when the item was published. 'Thu, 12 Nov 2015 21:16:39 +0000'
			pubDate: feed.pubDate,
			// Firebase would ignore author if empty string is sent
			author: feed.creator || null,
			// Used as a Key when saving feed
			timeUTC
		});
	});

	return prepared;
}

module.exports = {
	fetchFeed,
	getArticleContent,
	prepareFeedsForSave,
	getFullArticles
};
