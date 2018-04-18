import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';

const ajv = Ajv({ allErrors: true, jsonPointers: true });

ajvErrors(ajv);

const feedReqParams = {
	type: 'object',
	additionalProperties: false,
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
			minimum: 1,
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
	errorMessage: {
		type: HTTP_ERRORS.ParameterInvalid.type,
		required: HTTP_ERRORS.ParameterMissing.type,
		additionalProperties: HTTP_ERRORS.UnknownPropertyName.type,
	},
};

const validate = ajv.compile(feedReqParams);

export { validate };
