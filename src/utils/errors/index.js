import { logger } from '../../../lib/logger';

// TODO: Improve error handling
// https://github.com/hapijs/boom
// https://nemethgergely.com/error-handling-express-async-await/
// https://gist.github.com/slavafomin/b164e3e710a6fc9352c934b9073e7216

// eslint-disable-next-line no-unused-vars
const dev = (err, req, res, next) => {
	logger.error(err);

	if (err.name === 'UnauthorizedError') {
		res.status(500).json({
			status: 'error',
			code: 'unauthorizedError',
			message: err.stack || err,
		}).end();
		return;
	}

	res.status(500).json({
		status: 'error',
		code: 'unexpectedError',
		message: err.stack || err,
	}).end();
};

// eslint-disable-next-line no-unused-vars
const prod = (err, req, res, next) => {
	logger.error(err);

	if (err.name === 'UnauthorizedError') {
		res.status(500).json({
			status: 'error',
			code: 'UnauthorizedError',
			message: 'Invalid token',
		}).end();
		return;
	}

	res.status(500).json({
		status: 'error',
		code: 'unexpectedError',
		message: 'Something went wrong, we\'re looking into it...',
	}).end();
};

export { dev, prod };
