import * as FeedSchema from '../components/feed/feedSchema';
import { ApiError } from '../utils/errors/apiError';
import { HTTP_ERRORS } from '../utils/errors/errorsEnum';

/**
 * Paginate Feeds Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function paginateFeeds(req, res, next) {
	const query = {
		sources: req.query.sources ? req.query.sources.split(',') : [],
		includeContent: req.query.includeContent ? JSON.parse(req.query.includeContent) : false,
		language: req.query.language ? req.query.language : 'all',
		pageSize: req.query.pageSize ? JSON.parse(req.query.pageSize) : 20,
		page: req.query.page ? JSON.parse(req.query.page) : 0,
	};

	const valid = FeedSchema.validate(query);
	if (valid) {
		res.locals.sources = query.sources;
		res.locals.includeContent = query.includeContent;
		res.locals.language = query.language;
		res.locals.pageSize = query.pageSize;
		res.locals.page = query.page;

		return next();
	}

	// TODO: Handle 'sourcesTooMany' error
	return next(new ApiError(HTTP_ERRORS.ParameterInvalid));
}

export { paginateFeeds };
