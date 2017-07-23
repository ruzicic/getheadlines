const Koa = require('koa');
const Router = require('koa-router');

const {logger, morgan} = require('./scripts/logger');
const {initializeApp} = require('./scripts/main');

const port = 3028;
const app = new Koa();
const apiRouter = new Router({
	prefix: '/api'
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Logging middleware
logger.debug(`Setting up Morgan logger`);
app.use(morgan);

initializeApp();

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
