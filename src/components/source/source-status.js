const { pool } = require('../../utils/database');
const { getCurrentDatetime } = require('../../utils');
const logger = require('../../../lib/logger');

/**
 * Set default values and refresh interval for a source
 *
 * @method setInitialSourceStatus
 * @param {Object} source
 * @param {Number} period Source refresh interval
 * @return {Object} Source Status
 */
const setInitialSourceStatus = async ({ id, slug }, period) => {
	const now = getCurrentDatetime();

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

module.exports = {
	setInitialSourceStatus,
};
