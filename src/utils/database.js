import Pool from 'pg-pool';
import config from 'config';
import logger from '../../lib/logger';

const dbConfig = {
	database: config.get('db.database'),
	user: config.get('db.username'),
	password: config.get('db.password'),
	port: config.get('db.port'),
	// Ssl: true,
	max: 20, // Set pool max size to 20
	min: 1, // Set min pool size to 1
	idleTimeoutMillis: 1000, // Close idle clients after 1 second
};

const pool = new Pool(dbConfig);

pool.on('error', (error, client) => {
	// handle this in the same way you would treat process.on('uncaughtException')
	// it is supplied the error as well as the idle client which received the error
	logger.error('PG POOL Connection error', error, client);
});

pool.on('connect', () =>
	logger.info(`Connected to database ${dbConfig.database}:${dbConfig.port} as ${dbConfig.user}`));

export { pool };
