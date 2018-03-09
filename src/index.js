import 'babel-polyfill';

import config from 'config';
import express from 'express';
import http from 'http';

import bootstrap from './bootstrap';
import logger from './utils/logger';
import { normalizePort } from './utils';
import db from '../models';

const app = express();
const port = normalizePort(config.get('port'));
const host = config.get('host');

function onError(err) {
	if (err.syscall !== 'listen') throw err;
	logger.error(`Failed to start server: ${err}`);
	process.exit(1);
}

function onListening() {
	logger.info(`Server listening ${host}:${port}`);
}

async function checkDatabaseConnection() {
	try {
		await db.sequelize.authenticate();
		logger.info('Connection to database has been established successfully.');
	} catch (err) {
		logger.error('Unable to connect to the database:', err);
	}
}

app.start = async () => {
	logger.info('Starting Server...');

	app.set('port', port);
	bootstrap(app);
	await checkDatabaseConnection();

	const server = http.createServer(app);
	server.on('error', onError);
	server.on('listening', onListening);
	server.listen(port, host);
};

app.start().catch((err) => {
	logger.error(err);
});

export default app;
