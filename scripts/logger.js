const winston = require('winston');

winston.emitErrs = true;

const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			handleExeptions: true,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});

module.exports = logger;
