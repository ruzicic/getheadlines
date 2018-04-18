import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';

export default {
	type: 'object',
	additionalProperties: false,
	properties: {
		email: {
			type: 'string',
			format: 'email',
			description: 'User\'s email address.',
		},
		password: {
			type: 'string',
			minLength: 8,
			maxLength: 64,
			description: 'User\'s password.',
		},
	},
	required: ['email', 'password'],
	errorMessage: {
		type: HTTP_ERRORS.ParameterInvalid.type,
		required: HTTP_ERRORS.ParameterMissing.type,
		additionalProperties: HTTP_ERRORS.UnknownPropertyName.type,
	},
};
