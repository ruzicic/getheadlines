import logger from '../../config/logger';
import { HTTP_ERRORS } from '../utils/errors/errorsEnum';

/**
 * End request with a friendly JSON response,
 * including Error Stack Trace
 * @param {ApiError} err Instance of ApiError
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function developmentErrorHandler(err, req, res, next) {
	const statusCode = err.status || 500;
	logger.error(`${statusCode}: ${err.message}. [${req.method}] ${req.originalUrl} (${req.ip})`);

	res.status(statusCode).json({
		status: 'error',
		message: err.message || HTTP_ERRORS.InternalServerError,
		stack: err.stack || err,
	}).end();
}

/**
 * End request with a friendly JSON response
 * @param {ApiError} err Instance of ApiError
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function productionErrorHandler(err, req, res, next) {
	const statusCode = err.status || 500;
	logger.error(`${statusCode}: ${err.message}. [${req.method}] ${req.originalUrl} (${req.ip})`);

	res.status(statusCode).json({
		status: 'error',
		message: err.message || HTTP_ERRORS.InternalServerError,
	}).end();
}

export {
	developmentErrorHandler as dev,
	productionErrorHandler as prod,
};
