import logger from '../../../config/logger';
import * as SourceStatus from './sourceStatus';
import * as SourceSchema from './sourceSchema';
import * as SourceController from './sourceController';
import { formatSchemaErrors } from '../../utils/schema';
import { ApiError } from '../../utils/errors/apiError';
import HTTP_ERRORS from '../../utils/errors/errorsEnum';
import { isValidUrl } from '../../utils';

/**
 * Returns list of Sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function getAll(req, res, next) {
	try {
		const rawSources = await SourceController.getSources();
		const sources = rawSources.map(r => ({
			id: r.slug,
			name: r.name,
			description: r.description,
			homepage: r.description,
			language: r.language,
			country: r.country,
			category: r.category,
		}));

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
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
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

/**
 * Delete Source by url
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function remove(req, res, next) {
	const { url } = req.query;

	// Check if valid URL provided in res.query
	if (!url || !isValidUrl(url)) {
		return next(new ApiError(HTTP_ERRORS.badRequest));
	}

	// Check if source with provided url exist
	try {
		const sourceExist = await SourceController.checkSourceExist(url);
		if (!sourceExist) {
			return next(new ApiError(HTTP_ERRORS.sourceNotFound));
		}
	} catch (err) {
		return next(err);
	}

	try {
		await SourceController.deleteSource(url);
		return res.status(200).json({
			status: 'ok',
			message: `Source with url "${url}" deleted.`,
		}).end();
	} catch (err) {
		return next(err);
	}
}

export { getAll, add, remove };
