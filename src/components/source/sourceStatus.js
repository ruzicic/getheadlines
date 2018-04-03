import { pool } from '../../utils/database';
import { formatDateTime } from '../../utils';
import logger from '../../../lib/logger';

/**
 * Set default values and refresh interval for a source
 *
 * @method setInitialSourceStatus
 * @param {Object} source
 * @param {Number} period Source refresh interval
 * @return {Object} Source Status
 */
const setInitialSourceStatus = async ({ id, slug }, period) => {
	const now = formatDateTime();

	try {
		const result = await pool.query(`
			INSERT INTO source_status
				(source_id, period, updated)
			VALUES
				($1, $2, $3)
			RETURNING *
		`, [id,
			period,
			now,
		]);

		logger.info('[setInitialSourceStatus]', result.rows[0]);

		return result.rows[0];
	} catch (err) {
		logger.error('[setInitialSourceStatus]', err);
		throw new Error(`Could not set initial source status for: "${slug}"`);
	}
};

/**
 * Update "period" and "active" columns in Source Status
 *
 * @param {Object} sourceStatus Source status object
 * @return {Object} Source Status
 */
const updateSourceStatus = async ({ id, period, active }) => {
	const now = formatDateTime();

	if (!id || period || active) {
		throw new Error('[updateSourceStatus] requires ID, period and active properties');
	}

	try {
		const result = await pool.query(`
			UPDATE source_status
			SET
				period = ($2), active = ($3), updated = ($4)
			WHERE source_id = ($1)
			RETURNING *
		`, [id, period, active, now]);

		logger.info('[updateSourceStatus]', result.rows[0]);

		return result.rows[0];
	} catch (err) {
		logger.error('[updateSourceStatus]', err);
		throw new Error(`Could not supdate source status for source ID: "${id}"`);
	}
};

/**
 * Update "last_fetch" and "updated" columns in source_status
 *
 * @param {Number} id Source ID
 * @param {Number} lastFetch Last fetch datetime in UNIX seconds
 * @return {Object} Source Status
 */
const refreshSourceStatus = async (id, lastFetch) => {
	const now = formatDateTime();

	try {
		const result = await pool.query(`
			UPDATE source_status
			SET
				last_fetch = ($2), updated = ($3)
			WHERE source_id = ($1)
			RETURNING *
		`, [id, lastFetch, now]);

		return result.rows[0];
	} catch (err) {
		logger.error('[refreshSourceStatus]', err);
		throw new Error(`Could not supdate source status for source ID: "${id}"`);
	}
};

export {
	setInitialSourceStatus,
	updateSourceStatus,
	refreshSourceStatus,
};
