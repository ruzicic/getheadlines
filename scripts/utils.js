const parser = require('rss-parser');

const {logger} = require('./logger');

const fetchFeed = url => {
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

module.exports = {
	fetchFeed
};
