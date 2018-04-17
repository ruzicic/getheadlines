import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';

const ajv = Ajv({
	allErrors: true,
	jsonPointers: true,
});

ajvErrors(ajv);

const authSchema = {
	type: 'object',
	// Remove any extra properties
	additionalProperties: false,
	properties: {
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
		type: 'Exected object with email and password properties.',
		required: 'Required properties are both email and password.',
		additionalProperties: 'Request must contain email and password properties only.',
	},
};

const validate = ajv.compile(authSchema);

export { validate };
