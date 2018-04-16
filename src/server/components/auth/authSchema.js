import Ajv from 'ajv';

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });

const authSchema = {
	type: 'object',
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
};

const validate = ajv.compile(authSchema);

export { validate };
