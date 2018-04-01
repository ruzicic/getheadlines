const http = require('http');
const config = require('config');
const logger = require('../../lib/logger');

// TODO: FIX FOR PRODUCTION
// After build, app is in /dist, instead /src
const { app } = require('../../src/app');
const { initializeApp } = require('../../src/main');

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
	logger.info(`App running on ${bind}.`);

	if (config.has('validate')) {
		logger.info(config.get('validate'));
	} else {
		logger.warn('JSON config failed to load.');
	}

	// Initialize App after Express start
	initializeApp();
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
process.on('uncaughtException', err => logger.error(`Caught exception ${err}`));
