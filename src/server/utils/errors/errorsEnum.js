export default {
	/**
	 * General
	 */
	badRequest: {
		type: 'BadRequest',
		code: 400,
	},
	unauthorized: {
		type: 'Unauthorized',
		code: 401,
	},
	alreadyExist: {
		type: 'AlreadyExist',
		code: 409,
	},
	internalServerError: {
		type: 'InternalServerError',
		code: 500,
	},

	/**
	 * API
	 */
	parameterInvalid: {
		type: 'ParameterInvalid',
		code: 422,
	},
	parameterMissing: {
		type: 'ParameterMissing',
		code: 400,
	},
	rateLimited: {
		type: 'RateLimited',
		code: 429,
	},

	apiKeyInvalid: {
		type: 'ApiKeyInvalid',
		code: 401,
	},
	apiKeyMissing: {
		type: 'ApiKeyMissing',
		code: 401,
	},

	// Requested user doesn't exist
	userNotFound: {
		type: 'UserNotFound',
		code: 404,
	},

	// Requested source doesn't exist
	sourceNotFound: {
		type: 'SourceNotFound',
		code: 404,
	},

	// Requested feeds from too many sources
	sourcesTooMany: {
		type: 'SourcesTooMany',
		code: 400,
	},

	// Requested feeds from too many categories
	categoriesTooMany: {
		type: 'CategoriesTooMany',
		code: 400,
	},
};

// 	// 4xx
// 	400: 'Bad Request', // The request was unacceptable, often due to missing a required parameter.
// 	401: 'Unauthorized', // No valid API key provided.
// 	402: 'Request Failed', // The parameters were valid but the request failed.
// 	403: 'Forbidden',
// 	404: 'Not Found', // The requested resource doesn't exist.
// 	405: 'Method Not Allowed',
// 	408: 'Request Timeout',
// 	409: 'Conflict', // Already exist
// 	410: 'Gone',
// 	412: 'Precondition Failed',
// 	413: 'Payload Too Large',
// 	414: 'URI Too Long',
// 	416: 'Range Not Satisfiable',
// 	417: 'Expectation Failed',
// 	421: 'Misdirected Request',
// 	422: 'Unprocessable Entity',
// 	423: 'Locked',
// 	428: 'Precondition Required', // Could not create/update
// 	429: 'Too Many Requests', // Too many requests hit the API too quickly.
// 	431: 'Request Header Fields Too Large',
// 	451: 'Unavailable For Legal Reasons',

// 	// 5xx
// 	500: 'Internal Server Error',
// 	501: 'Not Implemented',
// 	505: 'HTTP Version Not Supported',
// The server does not support the HTTP protocol version used in the request.

