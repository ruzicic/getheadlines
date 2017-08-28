const Koa = require('koa');
const Router = require('koa-router');
const helmet = require('koa-helmet');

const {logger, morgan} = require('./scripts/logger');
const {initializeApp} = require('./scripts/main');

const {validateFeedRoute, validateToken} = require('./scripts/middlewares');
const {ProvidersHandler, FeedsHandler} = require('./scripts/handlers');
const {tryUrl} = require('./scripts/testing.js');

const port = process.env.PORT || 3028;

const v1 = new Router({
	prefix: '/v1'
});

const app = new Koa()
	.use(helmet())
	.use(morgan)
	.use(v1.routes())
	.use(v1.allowedMethods());

initializeApp();

/**
 * [GET] Get All Providers
 * Example usage: https://api.getheadlines.io/v1/providers
 */
v1.get('/providers', validateToken, ProvidersHandler.getAll);

/** 
 * [GET] Get all feeds for provider and its category
 * Example usage: https://api.getheadlines.io/v1/blic/zabava
 */
v1.get('/feeds/:provider/:category', validateToken, validateFeedRoute, FeedsHandler.get);

/** 
 * [GET] Test route
 * Example usage: https://api.getheadlines.io/v1/test
 */
v1.get('/test', tryUrl);

// Everything else, not covered by API Router
app.use(ctx => ctx.status = 401);

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
