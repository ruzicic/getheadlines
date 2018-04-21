import { Pool } from 'pg';
import logger from '../../config/logger';

/**
 * pool(s) will use environment variables for connection information
 * https://node-postgres.com/features/pooling
 */
const pool = new Pool();

pool.on('error', (err) => {
	logger.error('[node-postgres] Unexpected error on idle client', err);
	process.exit(1);
});

async function query(text, values) {
	const client = await pool.connect();

	try {
		return await client.query(text, values);
	} finally {
		client.release();
	}
}

export { query };
