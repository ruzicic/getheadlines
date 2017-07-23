const Morgan = require('koa-morgan');
const winston = require('winston');

winston.emitErrs = true;

// Available levels:
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: './logs/all-logs.log',
			handleExceptions: true,
			json: true,
			maxsize: 5242880, //5MB
			maxFiles: 5,
			colorize: false
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExeptions: true,
			json: false,
			// https://nodejs.org/api/tty.html#tty_tty
			colorize: process.stdout.isTTY,
			prettyPrint: true
		})
	],
	exitOnError: false
});

const stream = {
	write: (message, encoding) => {
		logger.info(message);
	}
}

const morgan = Morgan('common', {
	stream: stream
});

module.exports = {
	logger,
	morgan
};
