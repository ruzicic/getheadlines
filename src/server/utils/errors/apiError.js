import statuses from './httpStatusEnum';
import apiErrors from './apiErrorsEnum';

/**
 * Creates an API error
 * @extends Error
 * @param {String} message Error message
 * @param {String} status HTTP Status Code
 * @param {Boolean} isPublic If error message should be public
 */
export class ApiError extends Error {
	constructor(
		message,
		status,
		isPublic = true,
		...params
	) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}

		// Custom debugging information
		this.status = status || 400;
		this.isPublic = isPublic;

		// Message is eiter one from API Errors Enum
		// Or default HTTP message based on status (code)
		this.message = apiErrors[message] || statuses[status] || message;
	}
}
