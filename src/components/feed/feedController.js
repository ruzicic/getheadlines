import { pool } from '../../utils/database';
import logger from '../../../lib/logger';
import * as SourceStatus from '../source/sourceStatus';
import { formatDateTime } from '../../utils';

/**
 * Save Feeds
 * For better performance, we are not going to call Save Feeds often, but insted INSERT/UPDATE
 * multiple rows at once.
 * URL is the only Unique field (besides ID), so do UPDATE everything on conflict.
 *
 * @method saveFeeds
 * @param {Object} source
 * @param {Object[]} feeds
 * @return {Object} Created source
 */
const saveFeeds = async (source, feeds) => {
	const friendlyDate = formatDateTime(new Date(), 'detailed');
	let lastFetch;
	let insertResult;

	logger.info(`[saveFeeds][${source.slug}] Total: ${feeds.length} feeds. @${friendlyDate}`);

	const rows = [...feeds].map(feed => ({
		source_id: source.id,
		url: feed.link || feed.guid,
		excerpt: feed.content || feed.contentSnippet,
		updated: formatDateTime(),
		title: feed.title,
		pub_date: formatDateTime(feed.pubDate),
		description: feed.content,
		content: feed.articleContent,
		author: feed.author,
	}));

	/**
	 * id | source_id | url | excerpt | updated | title | pub_date | description | content | author
	 * Create VALUES groups, for multi row insert/update. Example:
	 * ($1, $2, $3, $4, $5, $6, $7, $8, $9), ($10, $11, $12, $13, $14, $15, $16, $17, $18), ($19,...
	 */
	let chunks = [];
	let values = [];
	rows.forEach((row) => {
		let valueClause = [];

		Object.keys(row).forEach((key) => {
			values = [...values, row[key]];
			valueClause = [...valueClause, `$${values.length}`];
		});

		chunks = [...chunks, `(${valueClause.join(', ')})`];
	});

	const queryText = `
		INSERT INTO feeds
			(source_id, url, excerpt, updated, title, pub_date, description, content, author)
		VALUES ${chunks.join(', ')}
		ON CONFLICT (url)
			DO UPDATE
				SET source_id = EXCLUDED.source_id, excerpt = EXCLUDED.excerpt, updated = EXCLUDED.updated,
					title = EXCLUDED.title, pub_date = EXCLUDED.pub_date, description = EXCLUDED.description,
					content = EXCLUDED.content, author = EXCLUDED.author
		RETURNING url
	`;

	// Save feeds
	try {
		insertResult = await pool.query(queryText, values);
		lastFetch = formatDateTime(new Date(), 'seconds');
	} catch (err) {
		logger.error('[saveFeeds] Could not save feeds', err);
		throw err;
	}

	// Refresh Source Status
	try {
		await SourceStatus.refreshSourceStatus(source.id, lastFetch);
	} catch (err) {
		logger.error('Could not [refreshSourceStatus] after [saveFeeds]', err);
	}

	return insertResult.rows;
};

export { saveFeeds };
