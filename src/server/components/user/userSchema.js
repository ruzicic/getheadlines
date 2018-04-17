import Ajv from 'ajv';

const ajv = Ajv({
	allErrors: true,
	jsonPointers: true,
});

const userSchema = {
	type: 'object',
	// Remove any extra properties
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
};

const validate = ajv.compile(userSchema);

export { validate };
