import { HTTP_ERRORS } from './errorsEnum';

/**
 * Creates an API error
 * @extends Error
 * @param {String} message Error message
 */
export class ApiError extends Error {
	constructor(name, ...params) {
		super(...params);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}

		// Get code and type from error.name, or set defaults
		const { code = 500, type = HTTP_ERRORS.InternalServerError } = name;

		this.name = name;
		this.status = code;
		this.message = type;
	}
}
