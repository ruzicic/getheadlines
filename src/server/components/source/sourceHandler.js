import logger from '../../../config/logger';
import * as SourceStatus from './sourceStatus';
import * as SourceSchema from './sourceSchema';
import * as SourceController from './sourceController';
import { formatSchemaErrors } from '../../utils/schema';
import { ApiError } from '../../utils/errors/apiError';

/**
 * Returns list of Sources
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function getAll(req, res, next) {
	try {
		const rawSources = await SourceController.getSources();
		const sources = rawSources.map((raw) => {
			const {
				slug: id,
				name,
				description,
				homepage,
				language,
				country,
				category,
			} = raw;

			return {
				id,
				name,
				description,
				homepage,
				language,
				country,
				category,
			};
		});

		return res
			.status(200)
			.json({
				status: 'ok',
				sources,
			})
			.end();
	} catch (err) {
		return next(new ApiError('Could not get Sources.'));
	}
}

/**
 * Creates new Source and returns it's Id
 * @param req
 * @param res
 * @returns {*}
 */
async function add(req, res) {
	const valid = SourceSchema.validate(req.body);

	// Validate request body using JSON schema
	if (!valid) {
		return res
			.status(422)
			.json({
				status: 'error',
				code: 'invalidSourceObject',
				message: formatSchemaErrors(SourceSchema.validate.errors),
			})
			.end();
	}

	// Check if source with provided url already exist
	const sourceExist = await SourceController.checkSourceExist(req.body.url);
	if (sourceExist) {
		return res
			.status(409)
			.json({
				status: 'error',
				code: 'sourceAlreadyExist',
				message: `Source "${req.body.name}" already exist. Id and URL must be unique.`,
			})
			.end();
	}

	try {
		const source = await SourceController.addSource(req.body);
		await SourceStatus.setInitialSourceStatus(source, req.body.period);

		return res.status(201).json({
			status: 'ok',
			message: {
				id: source.slug,
			},
		}).end();
	} catch (err) {
		logger.error(`[source] getAll: ${err}`);
		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
}

export { getAll, add };
