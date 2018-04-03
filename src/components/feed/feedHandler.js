import logger from '../../../lib/logger';
import * as FeedController from './feedController';

const get = async (req, res) => {
	const {
		sources,
		includeContent,
		language,
		pageSize,
		page,
	} = res.locals;

	try {
		const rawFeeds = await FeedController.getFeeds({
			sources,
			language,
			pageSize,
			page,
		});

		const feeds = rawFeeds.data.map((rawFeed) => {
			const {
				title,
				pub_date: timestamp,
				url,
				description,
				author,
				name: sourceName,
				slug: sourceId,
				content,
			} = rawFeed;

			// Convert timestamp to ISO Date
			const publishedAt = new Date(parseFloat(timestamp)).toISOString();

			const feed = {
				title,
				publishedAt,
				url,
				description,
				author,
				source: {
					id: sourceId,
					name: sourceName,
				},
			};

			// Optionally include feed content, depending on user's query
			if (includeContent) Object.assign(feed, { content });

			return feed;
		});

		return res
			.status(200)
			.json({
				status: 'ok',
				totalResults: rawFeeds.total,
				query: {
					sources,
					includeContent,
					language,
					pageSize,
					page,
				},
				feeds,
			})
			.end();
	} catch (err) {
		logger.error(`[feeds] get: ${err}`);

		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
};

export { get };
