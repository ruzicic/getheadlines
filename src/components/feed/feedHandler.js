import logger from '../../../lib/logger';
import * as FeedController from './feedController';

const get = async (req, res) => {
	try {
		const rawFeeds = await FeedController.getFeeds();
		const feeds = rawFeeds.data.map((feed) => {
			const {
				title,
				pub_date: timestamp,
				url,
				description,
				author,
				source_name: sourceName,
				source_id: sourceId,
			} = feed;

			const publishedAt = new Date(parseFloat(timestamp)).toISOString();
			return {
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
		});

		return res
			.status(200)
			.json({
				status: 'ok',
				totalResults: rawFeeds.total,
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
