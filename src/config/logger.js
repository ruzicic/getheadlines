import path from 'path';
import winston from 'winston';

const { createLogger, transports } = winston;

const logger = createLogger({
	transports: [
		new transports.File({
			name: 'all',
			level: 'info',
			filename: path.join('logs', 'all.json'),
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
		}),
		new transports.File({
			name: 'errors',
			level: 'error',
			filename: path.join('logs', 'error.json'),
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json(),
			),
		}),
	],
});

// If we're not in production then log to the `console`:
if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console({
		name: 'console',
		level: 'silly',
		silent: process.env.NODE_ENV === 'test', // do not log while running tests
		format: winston.format.combine(
			winston.format.colorize({ all: false }),
			winston.format.simple(),
		),
	}));
}

export default logger;
