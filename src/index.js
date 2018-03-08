import 'babel-polyfill';

import config from 'config';
import express from 'express';
import http from 'http';

import bootstrap from './bootstrap';
import { normalizePort } from './utils';
import logger from './utils/logger';

const app = express();

app.start = async () => {
	logger.info('Starting Server...');

	const port = normalizePort(config.get('port'));
	app.set('port', port);
	bootstrap(app);

	const server = http.createServer(app);

	server.on('error', (error) => {
		if (error.syscall !== 'listen') throw error;
		logger.error(`Failed to start server: ${error}`);
		process.exit(1);
	});

	server.on('listening', () => {
		const { address } = server.address();
		logger.info(`Server listening ${address}:${port}`);
	});

	server.listen(port);
};

app.start().catch((err) => {
	logger.error(err);
});

export default app;
