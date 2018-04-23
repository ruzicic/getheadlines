export const HTTP_ERRORS = {
	BadRequest: {
		type: 'BadRequest',
		code: 400,
	},
	Unauthorized: {
		type: 'Unauthorized',
		code: 401,
	},
	InvalidPassword: {
		type: 'InvalidPassword',
		code: 401,
	},
	InsufficientPermissions: {
		type: 'InsufficientPermissions',
		code: 403,
	},
	AlreadyExist: {
		type: 'AlreadyExist',
		code: 409,
	},
	InternalServerError: {
		type: 'InternalServerError',
		code: 500,
	},
	ParameterInvalid: {
		type: 'ParameterInvalid',
		code: 422,
	},
	ParameterMissing: {
		type: 'ParameterMissing',
		code: 400,
	},
	UnknownPropertyName: {
		type: 'UnknownPropertyName',
		code: 400,
	},
	RateLimited: {
		type: 'RateLimited',
		code: 429,
	},
	ApiKeyInvalid: {
		type: 'ApiKeyInvalid',
		code: 401,
	},
	ApiKeyMissing: {
		type: 'ApiKeyMissing',
		code: 401,
	},
	ApiKeyExpired: {
		type: 'ApiKeyExpired',
		code: 401,
	},
	UserNotFound: {
		type: 'UserNotFound',
		code: 404,
	},

	// Requested Source doesn't exist
	SourceNotFound: {
		type: 'SourceNotFound',
		code: 404,
	},

	// Requested feeds from too many sources
	SourcesTooMany: {
		type: 'SourcesTooMany',
		code: 400,
	},

	// Requested feeds from too many categories
	CategoriesTooMany: {
		type: 'CategoriesTooMany',
		code: 400,
	},
};
