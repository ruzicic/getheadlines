import path from 'path';
import winston from 'winston';

const { createLogger, transports, format } = winston;
// eslint-disable-next-line object-curly-newline
const { combine, timestamp, json, simple, colorize } = format;

const logger = createLogger({
	transports: [
		new transports.File({
			name: 'all',
			level: 'info',
			filename: path.join('logs', 'all.json'),
			format: combine(timestamp(), json()),
		}),
		new transports.File({
			name: 'errors',
			level: 'error',
			filename: path.join('logs', 'error.json'),
			format: combine(timestamp(), json()),
		}),
	],
});

// If we're not in production then log to the `console`:
if (process.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console({
		name: 'console',
		level: 'silly',
		// Important: Do NOT log while running tests
		silent: process.env.NODE_ENV === 'test',
		format: combine(colorize({ all: false }), simple()),
	}));
}

export default logger;
