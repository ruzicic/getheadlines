import 'dotenv/config';
import config from 'config';
import http from 'http';
import app from './config/express';
import logger from './config/logger';
import { initializeApp } from './server/main';

const debug = require('debug')('getheadlines:server');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	const port = parseInt(val, 10);
	const isNumber = value => !Number.isNaN(parseFloat(value));

	if (isNumber(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || config.get('port') || 3000);
app.set('port', port);


/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case 'EACCES':
		logger.error(`${bind} requires elevated privileges`);
		process.exit(1);
		break;
	case 'EADDRINUSE':
		logger.error(`${bind} is already in use`);
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
	logger.info(`App running on ${bind} (${process.env.NODE_ENV}).`);

	// Initialize App after Express start
	initializeApp();

	if (process.env.NODE_ENV === 'DEBUG') {
		debug(`App running on ${bind}.`);
	}
}

/**
 * Listen on provided port, on all network interfaces.
 *
 * module.parent check is required to support mocha watch
 * https://github.com/mochajs/mocha/issues/1912
 */

if (!module.parent) {
	server.listen(port);
}

server.on('error', onError);
server.on('listening', onListening);
process.on('uncaughtException', err => logger.error(`Caught exception ${err}`));
