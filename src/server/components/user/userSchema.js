import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';

export default {
	type: 'object',
	additionalProperties: false,
	properties: {
		name: {
			type: 'string',
			description: 'User First, Last, or Username. Minimum length 3 characters. Maximum length 64 characters.',
			minLength: 3,
			maxLength: 64,
		},
		email: {
			type: 'string',
			format: 'email',
			description: 'User\'s email address.',
		},
		password: {
			type: 'string',
			description: 'User\'s password.',
			minLength: 8,
			maxLength: 64,
			invalidMessage: 'Password must contain minimum eight characters',
		},
	},
	required: ['email', 'password'],
	errorMessage: {
		type: HTTP_ERRORS.ParameterInvalid.type,
		required: HTTP_ERRORS.ParameterMissing.type,
		additionalProperties: HTTP_ERRORS.UnknownPropertyName.type,
	},
};
