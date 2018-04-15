import { pool } from '../../utils/database';
import logger from '../../../config/logger';

/**
 * Check if Source with URL already exist in database
 * @method checkSourceExist
 * @param {String} url
 * @return {Promise<Boolean, ApiError>}
 */
async function checkSourceExist(url) {
	try {
		const result = await pool.query(
			'SELECT exists( SELECT true FROM sources WHERE url = ($1))',
			[url],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error(`Error checking if source with url "${url}" exist`, err);
		throw err;
	}
}

/**
 * Get All Sources
 * @method getSources
 * @return {Promise<Array, ApiError>} List of all available sources
 */
async function getSources() {
	// TODO: Add pagination
	try {
		const result = await pool.query(`
			SELECT id, name, description, slug, homepage, url, language, country, category
			FROM sources
			`);

		return result.rows;
	} catch (err) {
		logger.error('Could not get Sources', err);
		throw err;
	}
}

/**
 * Get All Sources with status
 * @method getSourcesWithStatus
 * @return {Promise<Array, ApiError>} List of all available sources with their status
 */
async function getSourcesWithStatus() {
	// TODO: Add pagination
	try {
		const result = await pool.query(`
			SELECT
				sources.id, sources.name, sources.slug, sources.url,
				source_status.period, source_status.active, source_status.last_fetch, source_status.updated
			FROM sources
			INNER JOIN source_status
			ON source_status.source_id = sources.id
			`);

		return result.rows;
	} catch (err) {
		logger.error('Could not get sources with status', err);
		throw err;
	}
}

/**
 * Add new source to database and return it
 * @method addSource
 * @param {Object} source
 * @return {Promise<Object, ApiError>} Created source
 */
async function addSource(source) {
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

		return result.rows[0];
	} catch (err) {
		logger.error('Could not add new source', err);
		throw err;
	}
}

// TODO: Add Delete Source

export {
	checkSourceExist,
	getSources,
	getSourcesWithStatus,
	addSource,
};
