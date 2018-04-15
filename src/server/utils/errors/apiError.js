import HTTP_ERRORS from './errorsEnum';

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

		this.name = name;
		this.status = HTTP_ERRORS[name].code || 500;
		this.message = HTTP_ERRORS[name].type || 'InternalServerError';
	}
}
