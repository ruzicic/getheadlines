const Koa = require('koa');
const fetch = require('node-fetch');
const Router = require('koa-router');
const {xmlToJson, parseFeed} = require('./helpers.js');
const {getProviders,
    createRoutes,
    providersCached,
    updateRefreshRecords,
    saveToFirebase,
    getAvailableProviders,
    isValidRoute,
	isValidToken,
    getSomeNews} = require('./firebase/main.js');

const port = 3028;
const app = new Koa();
const apiRouter = new Router({
	prefix: '/api'
});

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

const fetchFeed = (provider, name) => {
	if (!provider.active) {
        // console.log(`NOT fetching ${provider.uri}. Active: ${provider.active}`);
		return;
	}

    // console.log(`Fetching ${provider.name}. Active: >>${provider.active}<<, lastRefresh: ${provider.lastRefresh}`);
	return fetch(provider.uri)
        .then(response => response.text())
        .then(xmlToJson)
        .then(parseFeed)
        .then(response => {
	console.log(`Fetch success for ${name}`);
	saveToFirebase(name, response);
})
        .catch(err => {
	console.error(`Error fetching feed ${name}: ${provider.uri}`);
	console.error(err);
});
};

const init = async () => {
	try {
		await getProviders();
		await createRoutes();
		await providersCached.forEach((providerObject, providerName) => {
			fetchFeed(providerObject, providerName);
			updateRefreshRecords(providerName);
		});
	} catch (err) {
		console.error('Error on init');
		console.error(err);
	}
};

init();

apiRouter.get('/available', async ctx => {
	ctx.body = await getAvailableProviders();
});

apiRouter.get('/:provider/:options', async ctx => {
	let isValidPath = await isValidRoute(ctx.params.provider, ctx.params.options);
	let token = await isValidToken(ctx.header.authorization);

	if (isValidPath.status && token) {
		ctx.body = await getSomeNews(ctx.params.options);
	} else {
		ctx.body = {
			isValidToken: token ? true : false,
			isValidPath: isValidPath.message
		}
	}
});

// Everything else, not covered by apiRouter.routes()
app.use(ctx => ctx.status = 401);

app.on('error', (err, ctx) => {
	console.error('Internal error :(', err, ctx);
});

app.listen(port, () => {
	console.log(`app started on port ${port}`);
});
