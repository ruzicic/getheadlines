const Koa = require('koa');
const Router = require('koa-router');

const logger = require('./scripts/logger');
const {initializeApp} = require('./scripts/main');

const port = 3028;
const app = new Koa();
const apiRouter = new Router({
	prefix: '/api'
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

initializeApp();

app.listen(port, () => {
	logger.info(`App running on port ${port}`);
});
