const {verifyToken} = require('../firebase/api-services');

const validateToken = async (ctx, next) => {
    const authHeader = ctx.request.header.authorization;

    if (typeof authHeader === 'undefined') {
        ctx.response.status = 403;
        ctx.body = {
            error: 'FORBIDDEN',
            message: `Authorization header not found`
        }
        return;
    }

    const isValidToken = await verifyToken(authHeader);

    if (!isValidToken) {
        ctx.response.status = 403;
        ctx.body = {
            error: 'FORBIDDEN',
            message: `Bad token provided`
        }
        return;
    }

    await next();
}

module.exports =  validateToken;
