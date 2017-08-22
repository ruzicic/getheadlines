const {getFeeds} = require('../firebase/api-services');

const DEFAULT_LIMIT = 20; 
const DEFAULT_SORT = 'ASC';

const get = async ctx => {
    const {provider, category} = ctx.params;
    const {limit, sort} = ctx.query;

    if (sort &&
        sort.toUpperCase() !== 'ASC' &&
        sort.toUpperCase() !== 'DESC') {
        
        ctx.response.status = 400;
        ctx.body = {
            error: 'BAD_REQUEST',
            message: `Unknown sort type ${sort}. Allowed types: ASC or DESC`
        }
        return;
    }

    const query = {
        limit: ctx.query.limit || DEFAULT_LIMIT,
        sort: ctx.query.sort || DEFAULT_SORT
    }

    const feedsRef = await getFeeds(category, query);
    
    ctx.body = {
        provider,
        category,
        query,
        data: feedsRef
    }
}

module.exports = {
    get
};
