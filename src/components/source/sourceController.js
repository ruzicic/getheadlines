import { pool } from '../../utils/database';
import logger from '../../../lib/logger';

/**
 * Check if Source with URL already exist in database
 *
 * @method checkSourceExist
 * @param {String} url
 * @return {Boolean}
 */
const checkSourceExist = async (url) => {
	try {
		const result = await pool.query(
			'SELECT exists( SELECT true FROM sources WHERE url = ($1))',
			[url],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error('[checkSourceExist]', err);
	}

	return false;
};

/**
 * Get All Sources
 *
 * @method getSources
 * @return {Array} List of all available sources
 */
const getSources = async () => {
	let result = [];

	try {
		result = await pool.query(`
			SELECT id, name, description, slug, homepage, url, language, country, category
			FROM sources
			`);

		return result.rows;
	} catch (err) {
		logger.error('[getSources]', err);
	}

	return result;
};

/**
 * Get All Sources with status
 *
 * @method getSourcesWithStatus
 * @return {Array} List of all available sources with their status
 */
const getSourcesWithStatus = async () => {
	let result = [];

	try {
		result = await pool.query(`
			SELECT
				sources.id, sources.name, sources.slug, sources.url,
				source_status.period, source_status.active, source_status.last_fetch, source_status.updated
			FROM sources
			INNER JOIN source_status
			ON source_status.source_id = sources.id
			`);

		return result.rows;
	} catch (err) {
		logger.error('[getSourcesWithStatus]', err);
	}

	return result;
};


/**
 * Add new Source
 *
 * @method addSource
 * @param {Object} source
 * @return {Object} Created source
 */
const addSource = async (source) => {
	try {
		const result = await pool.query(`
			INSERT INTO sources
				(name, description, slug, homepage, url, image, language, country, category)
			VALUES
				($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING
				id, name, description, slug, homepage, language, country, category
		`, [source.name,
			source.description,
			source.slug,
			source.homepage,
			source.url,
			source.image,
			source.language,
			source.country,
			source.category,
		]);

		logger.info('[addSource]', result.rows[0]);

		// TODO: Dispatch 'slug' of new Source
		// And run job for it

		return result.rows[0];
	} catch (err) {
		logger.error('[addSource]', err);
		throw new Error(`Could not add source ${source}`);
	}
};

export {
	checkSourceExist,
	getSources,
	getSourcesWithStatus,
	addSource,
};
