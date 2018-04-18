import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';

export default {
	type: 'object',
	additionalProperties: false,
	properties: {
		name: {
			type: 'string',
			description: 'The name of the news source',
		},
		description: {
			type: 'string',
			description: 'A description of the news source',
		},
		slug: {
			type: 'string',
			description: 'The identifier of the news source. You can use this with our other endpoints.',
			lowercase: true,
		},
		homepage: {
			type: 'string',
			description: 'The homepage of the news source',
			format: 'url',
		},
		url: {
			type: 'string',
			description: 'The URL of the homepage.',
			format: 'url',
		},
		image: {
			type: 'string',
			description: 'The logo of the news source.',
		},
		language: {
			type: 'string',
			description: 'The language that this news source writes in.',
			enum: ['en', 'sr'],
			lowercase: true,
			minLength: 2,
			maxLength: 2,
		},
		country: {
			type: 'string',
			description: 'The country this news source is based in (or primarily writes about).',
			lowercase: true,
			minLength: 2,
			maxLength: 2,
		},
		category: {
			type: 'string',
			description: 'The type of news to expect from this news source.',
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
		period: {
			type: 'number',
			description: 'The time period in which the news from this news source will be refreshed',
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
		'period',
	],
	errorMessage: {
		type: HTTP_ERRORS.ParameterInvalid.type,
		required: HTTP_ERRORS.ParameterMissing.type,
		additionalProperties: HTTP_ERRORS.UnknownPropertyName.type,
	},
};
