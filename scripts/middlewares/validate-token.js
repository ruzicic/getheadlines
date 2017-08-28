const {validateUserToken} = require('../firebase/api-services');

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

    // const isValidToken = await validateUserToken(authHeader);

    // if (!isValidToken) {
    //     ctx.response.status = 403;
    //     ctx.body = {
    //         error: 'FORBIDDEN',
    //         message: `Bad token provided`
    //     }
    //     return;
    // }

    // console.info(`Provided token validation: ${isValidToken}`);

    await next();
}

module.exports =  validateToken;
