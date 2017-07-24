const {getRoutes} = require('../firebase/api-services');

// Check if route /feeds/:provider/:category exist
const validateFeedRoute = async (ctx, next) => {
    const {provider, category} = ctx.params;

    const routesRef = await getRoutes();
    const routes = routesRef.val();

    const providerExist = routes[provider];
    if (typeof providerExist === 'undefined') {
        ctx.response.status = 404;
        ctx.body = {
            error: 'NOT_FOUND',
            message: `Provider '${provider}' does not exist.`
        }
        return;
    }

    const categoryExist = providerExist[category];
    if (typeof categoryExist === 'undefined') {
        ctx.response.status = 404;
        ctx.body = {
            error: 'NOT_FOUND',
            message: `Category '${category}' in '${provider}' does not exist.`
        }
        return;
    }

    await next();
}

module.exports = {
    validateFeedRoute
};
