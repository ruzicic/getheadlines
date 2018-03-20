const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: 'warn',
			filename: 'winston-errors.log',
			handleExceptions: true,
			json: false,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExeptions: true,
			json: false,
			colorize: process.stdout.isTTY,
			prettyPrint: true,
		}),
	],
	exitOnError: false,
});

module.exports = logger;
