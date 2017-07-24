const {getRoutes} = require('../firebase/api-services');

const getAll = async ctx => {
    const routesRef = await getRoutes();
    ctx.body = routesRef.val();
}

module.exports = {
    getAll
};
