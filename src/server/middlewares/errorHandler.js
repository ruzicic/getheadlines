import logger from '../../config/logger';
import httpStatus from '../utils/errors/httpStatusEnum';

/**
 * End request with a friendly JSON response,
 * including Error Stack Trace
 * @param {ApiError|AppError} err Instance of either ApiError or AppError
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function developmentErrorHandler(err, req, res, next) {
	logger.error('[developmentErrorHandler]', err);

	const statusCode = err.status || 500;

	res.status(statusCode).json({
		status: 'error',
		message: err.message || httpStatus[500],
		stack: err.stack || err,
	}).end();
}

/**
 * End request with a friendly JSON response
 * @param {ApiError|AppError} err Instance of either ApiError or AppError
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function productionErrorHandler(err, req, res, next) {
	logger.error('[productionErrorHandler]', err);

	const statusCode = err.status || 500;

	res.status(statusCode).json({
		status: 'error',
		message: err.message || httpStatus[500],
	}).end();
}

export {
	developmentErrorHandler as dev,
	productionErrorHandler as prod,
};
