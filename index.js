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

// API Router
apiRouter.get('/providers', validateToken, ProvidersHandler.getAll);
apiRouter.get('/feeds/:provider/:category', validateToken, validateFeedRoute, FeedsHandler.get);

// Everything else, not covered by API Router
app.use(ctx => ctx.status = 401);

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
