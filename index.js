const Koa = require('koa');
const Router = require('koa-router');
const helmet = require('koa-helmet');

const {logger, morgan} = require('./scripts/logger');
const {initializeApp} = require('./scripts/main');

const {validateFeedRoute, validateToken} = require('./scripts/middlewares');
const {ProvidersHandler, FeedsHandler} = require('./scripts/handlers');

const port = process.env.PORT || 3028;

const apiRouter = new Router({
	prefix: '/api'
});

const app = new Koa()
	.use(helmet())
	.use(morgan)
	.use(apiRouter.routes())
	.use(apiRouter.allowedMethods());

initializeApp();

/**
 * @api {get} /providers Get All Providers
 * @apiVersion 1.0.0
 * @apiName Providers
 * @apiGroup Providers
 * 
 * @apiDescription Get a list of all available feed providers
 * 
 * @apiExample Example usage:
 * curl --header "Authorization: YOUR-API-KEY" https://getheadlines.io/api/blic/zabava
 * 
 * @apiHeader {String} Authorization Authorization token - Your personal API key
 * 
 * @apiError NoToken 403 Authorization header not found
 * @apiError BadToken 403 Bad token provided
 * 
 * @apiSuccess {Object[]} providers List of all active providers
 */
apiRouter.get('/providers', validateToken, ProvidersHandler.getAll);

/**
 * @api {get} /feeds/:provider/:category Get feeds
 * @apiVersion 1.0.0
 * @apiName GetFeeds
 * @apiGroup Feeds
 * 
 * @apiDescription Get all feeds for provider and its category
 * 
 * @apiExample Example usage:
 * curl --header "Authorization: YOUR-API-KEY" https://getheadlines.io/api/blic/zabava
 * 
 * @apiHeader {String} Authorization Authorization token - Your personal API key
 * 
 * @apiError NoToken 403 Authorization header not found
 * @apiError BadToken 403 Bad token provided
 * 
 * @apiSuccess {String} provider Provider name
 * @apiSuccess {String} category Category of provider
 * @apiSuccess {Object[]} query Query for which request is returned
 * @apiSuccess {Object[]} data List of feeds
 */
apiRouter.get('/feeds/:provider/:category', validateToken, validateFeedRoute, FeedsHandler.get);

// Everything else, not covered by API Router
app.use(ctx => ctx.status = 401);

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
