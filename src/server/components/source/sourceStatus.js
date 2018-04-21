import { query } from '../../utils/database';
import logger from '../../../config/logger';

/**
 * Set default values and refresh interval for a source
 *
 * @method setInitialSourceStatus
 * @param {Object} source
 * @param {Number} period Source refresh interval
 * @return {Object} Source Status
 */
const setInitialSourceStatus = async ({ id, slug }, period) => {
	try {
		const result = await query(`
			INSERT INTO source_status
				(source_id, period)
			VALUES
				($1, $2)
			RETURNING *
		`, [id, period]);

		// logger.info('[setInitialSourceStatus]', result.rows[0]);
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
	if (!id || period || active) {
		throw new Error('[updateSourceStatus] requires ID, period and active properties');
	}

	try {
		const result = await query(`
			UPDATE source_status
			SET
				period = ($2), active = ($3)
			WHERE source_id = ($1)
			RETURNING *
		`, [id, period, active]);

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
	try {
		const result = await query(`
			UPDATE source_status
			SET
				last_fetch = ($2)
			WHERE source_id = ($1)
			RETURNING *
		`, [id, lastFetch]);

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
