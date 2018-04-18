import { HTTP_ERRORS } from './errorsEnum';
import { ApiError } from './apiError';

/**
 * Returns new ApiError based on the name of given Ajv error(s)
 * or fallback to default error - Bad Request
 * @param  {Array} schemaErrors Ajv validate errors array
 * @return {ApiError}
 */
function schemaErr(schemaErrors = []) {
	const knownError = schemaErrors
		.find(err => err.message && HTTP_ERRORS[err.message]);

	if (knownError) {
		return new ApiError(HTTP_ERRORS[knownError.message]);
	}

	return new ApiError(HTTP_ERRORS.BadRequest);
}

export { schemaErr };
