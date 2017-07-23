const Koa = require('koa');
const Router = require('koa-router');
const helmet = require('koa-helmet');

const {logger, morgan} = require('./scripts/logger');
const {initializeApp} = require('./scripts/main');

const {validateFeedRoute} = require('./scripts/middlewares');
const {ProvidersHandler, FeedsHandler} = require('./scripts/handlers');

const port = 3028;
const app = new Koa();
const apiRouter = new Router({
	prefix: '/api'
});

app.use(helmet());
app.use(morgan);
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

initializeApp();

// API Router
apiRouter.get('/providers', ProvidersHandler.getAll);
apiRouter.get('/feeds/:provider/:category', validateFeedRoute, FeedsHandler.get);

// Everything else, not covered by apiRouter.routes()
app.use(ctx => ctx.status = 401);

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
