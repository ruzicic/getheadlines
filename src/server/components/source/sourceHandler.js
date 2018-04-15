import logger from '../../../config/logger';
import * as SourceStatus from './sourceStatus';
import * as SourceSchema from './sourceSchema';
import * as SourceController from './sourceController';
import { formatSchemaErrors } from '../../utils/schema';
import { ApiError } from '../../utils/errors/apiError';
import HTTP_ERRORS from '../../utils/errors/errorsEnum';

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
		return next(err);
	}
}

/**
 * Creates new Source and returns it's Id
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function add(req, res, next) {
	const valid = SourceSchema.validate(req.body);

	// Validate request body using JSON schema
	if (!valid) {
		logger.error('[source.add]', formatSchemaErrors(SourceSchema.validate.errors));
		return next(new ApiError(HTTP_ERRORS.parameterInvalid));
	}

	// Check if source with provided url already exist
	try {
		const sourceExist = await SourceController.checkSourceExist(req.body.url);
		if (sourceExist) {
			logger.error(`Source "${req.body.name}" already exist. Id and URL must be unique.`);
			return next(new ApiError(HTTP_ERRORS.alreadyExist));
		}
	} catch (err) {
		return next(err);
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
		logger.error('[source.add]', err);
		return next(err);
	}
}

export { getAll, add };
