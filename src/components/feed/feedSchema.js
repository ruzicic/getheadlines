import Ajv from 'ajv';

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });
const feedReqParams = {
	type: 'object',
	properties: {
		sources: {
			type: 'array',
			description: 'Filter feeds from these sources',
			maxItems: 5,
			minItems: 0,
			unique: true,
			items: {
				type: 'string',
			},
		},
		includeContent: {
			type: 'boolean',
			description: 'Include Article content in response. Default false.',
		},
		language: {
			type: 'string',
			description: 'The 2-letter ISO-639-1 code of the language you want to get feeds for. Default: all languages returned.',
			enum: ['all', 'en', 'sr'],
			minLength: 2,
			maxLength: 3,
		},
		pageSize: {
			type: 'number',
			description: 'The number of results to return per page. 20 is the default, 100 is the maximum',
			maximum: 100,
			minimum: 10,
		},
		page: {
			type: 'number',
			description: 'Use this to page through the results. Page count starts from 0.',
			minimum: 0,
		},
	},
	required: [
		'sources',
		'includeContent',
		'language',
		'pageSize',
		'page',
	],
};

const validateFeedRequest = ajv.compile(feedReqParams);

export { validateFeedRequest };
