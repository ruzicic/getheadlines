const Ajv = require('ajv');

const ajv = Ajv({ allErrors: true });

const sourceSchema = {
	type: 'object',
	properties: {
		name: {
			type: ['string'],
		},
		description: {
			type: ['string'],
		},
		slug: {
			type: ['string'],
			lowercase: true,
		},
		homepage: {
			type: ['string'],
			format: 'url',
		},
		url: {
			type: ['string'],
			format: 'url',
		},
		image: {
			type: ['string'],
		},
		language: {
			type: ['string'],
			enum: ['en', 'sr'],
			lowercase: true,
			minLength: 2,
			maxLength: 2,
		},
		country: {
			type: ['string'],
			lowercase: true,
			minLength: 2,
			maxLength: 2,
		},
		category: {
			type: ['string'],
			enum: [
				'business',
				'entertainment',
				'general',
				'health',
				'science',
				'sports',
				'technology',
			],
			lowercase: true,
		},
	},
	required: [
		'name',
		'slug',
		'homepage',
		'url',
		'language',
		'country',
		'category',
	],
};

const validate = ajv.compile(sourceSchema);

module.exports = validate;
