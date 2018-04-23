import { query } from '../../utils/database';
import logger from '../../../config/logger';
import * as SourceStatus from '../source/sourceStatus';

/**
 * Remove X number of Feeds for Provider,
 * leaving only fixed number in database
 *
 * @param {Number} sourceId Source Id
 * @param {Number} amountToKeep Number of Feeds from Provider to keep
 */
async function clearOldFeeds(sourceId, amountToKeep = 100) {
	const queryText = `
		DELETE
		FROM feeds
		WHERE source_id = ${sourceId}
		AND id NOT IN (
			SELECT id
			FROM feeds
			WHERE source_id = ${sourceId}
			ORDER BY id LIMIT ${amountToKeep}
		);
	`;

	try {
		const res = await query(queryText);
		logger.info(`[clearOldFeeds] Total ${res.rowCount}`);

		return res;
	} catch (err) {
		logger.error('[clearOldFeeds] Could not clear old feeds', err);
		throw err;
	}
}

/**
 * Save Feeds
 * For better performance, we are not going to call Save Feeds often, but insted INSERT/UPDATE
 * multiple rows at once.
 * URL is the only Unique field (besides ID), so do UPDATE everything on conflict.
 *
 * @method saveFeeds
 * @param {Object} source
 * @param {Object[]} feeds
 * @return {Promise<Object, Error>} Created source
 */
async function saveFeeds(source, feeds) {
	let lastFetch;
	let insertResult;

	logger.info(`[saveFeeds][${source.slug}] Total: ${feeds.length} feeds. @${Date.now()}`);

	const rows = [...feeds].map(feed => ({
		source_id: source.id,
		url: feed.link || feed.guid,
		excerpt: feed.contentSnippet || feed.content,
		title: feed.title,
		pub_date: new Date(feed.pubDate),
		description: feed.content,
		content: feed.articleContent,
		author: feed.author,
	}));

	/**
	 * id | source_id | url | excerpt | title | pub_date | description | content | author
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
			(source_id, url, excerpt, title, pub_date, description, content, author)
		VALUES ${chunks.join(', ')}
		ON CONFLICT (url)
			DO UPDATE
				SET source_id = EXCLUDED.source_id, excerpt = EXCLUDED.excerpt, title = EXCLUDED.title,
					pub_date = EXCLUDED.pub_date, description = EXCLUDED.description,
					content = EXCLUDED.content, author = EXCLUDED.author
		RETURNING url
	`;

	// Save feeds
	try {
		insertResult = await query(queryText, values);
		lastFetch = new Date();
	} catch (err) {
		logger.error('Could not save feeds', err);
		throw err;
	}

	// Clear old feeds (we're saving a limited number of feeds per source)
	try {
		await clearOldFeeds(source.id);
	} catch (err) {
		logger.error('Could not clear old feeds', err);
		throw err;
	}

	// Refresh Source Status
	try {
		await SourceStatus.refreshSourceStatus(source.id, lastFetch);
	} catch (err) {
		logger.error('Could not Refresh Source Status after saving feeds', err);
		throw err;
	}

	return insertResult.rows;
}

/**
 * Get Feeds
 * Query feeds table with provided request params
 * @param {Object} req.params (sources, language, pageSize, page)
 * @return {Promise<Object, Error>} Total number of matching results and limited array of results
 */
async function getFeeds({ sources, pageSize, page }) {
	let data = [];
	let total = 0;

	// Check 'sources' array and create WHERE conditions
	const condition = [...sources].reduce((res, curr, i) => {
		if (typeof curr !== 'string') return res;
		return (i === 0 ? `WHERE sources.slug = '${curr}'` : `${res} OR sources.slug = '${curr}'`);
	}, '');

	try {
		const result = await query(`
			SELECT
				feeds.title, feeds.pub_date, feeds.url, feeds.description, feeds.author, feeds.content,
				sources.name, sources.slug,
					count(*) OVER() AS total_results
			FROM feeds
			INNER JOIN sources
				ON sources.id = feeds.source_id
			${condition}
			LIMIT ${pageSize} OFFSET ${page}
		`);

		data = [...result.rows];

		// If there are results, get total
		if (result.rows.length > 0) {
			total = result.rows[0].total_results;
		}
	} catch (err) {
		logger.error('Error getting feeds', err);
		throw err;
	}

	return {
		total,
		data,
	};
}

export { saveFeeds, getFeeds };
