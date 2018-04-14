/**
 * Creates an App Error
 * @extends Error
 * @param {String} message Error message
 */
export class AppError extends Error {
	constructor(message = 'Unknown App Error', status = 500, ...params) {
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}

		// Custom debugging information
		this.message = message;
		this.status = status;
		this.isPublic = false;
	}
}

