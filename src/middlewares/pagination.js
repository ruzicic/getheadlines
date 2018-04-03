import * as FeedSchema from '../components/feed/feedSchema';
import { formatSchemaErrors } from '../utils/schema';

const paginateFeeds = (req, res, next) => {
	const query = {
		sources: req.query.sources ? req.query.sources.split(',') : [],
		includeContent: req.query.includeContent ? JSON.parse(req.query.includeContent) : false,
		language: req.query.language ? req.query.language : 'all',
		pageSize: req.query.pageSize ? JSON.parse(req.query.pageSize) : 20,
		page: req.query.page ? JSON.parse(req.query.page) : 0,
	};

	const valid = FeedSchema.validateFeedRequest(query);
	if (valid) {
		res.locals.sources = query.sources;
		res.locals.includeContent = query.includeContent;
		res.locals.language = query.language;
		res.locals.pageSize = query.pageSize;
		res.locals.page = query.page;

		return next();
	}

	return res
		.status(422)
		.json({
			status: 'error',
			code: 'invalidRequestQuery',
			message: formatSchemaErrors(FeedSchema.validateFeedRequest.errors),
		})
		.end();
};

export { paginateFeeds };
