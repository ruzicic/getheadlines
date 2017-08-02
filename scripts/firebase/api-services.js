/**
 * PUBLIC methods - will be used by REST API
 */

const {logger} = require('../logger');
const {db, getRef} = require('./db');

// Returns lastRefresh and nextRefresh timestamps
const getRoutes = () => {
	try {
		return getRef(db.routes).once('value');
	} catch (err) {
		logger.error(`Error getting routes`);
		logger.error(err);
	}
};

const getFeeds = async (category, params) => {
    const {limit, sort} = params;
    let feeds = [];

    if (sort.toUpperCase() === 'ASC') {

        try {
            await getRef(db.feeds)
                .child(category)
                .limitToLast(Number(limit))
                .once('value')
                .then(snapshot => {
                    snapshot.forEach(snap => {
                        feeds.push(snap.val());
                    });
                });
        } catch (err) {
            logger.error(`Error getting feeds for ${category} limit: ${limit} sort: ${sort}`);
            logger.error(err);
        }

    } else {

        try {
            await getRef(db.feeds)
                .child(category)
                .limitToFirst(limit)
                .once('value')
                .then(snapshot => {
                    snapshot.forEach(snap => {
                        feeds.push(snap.val());
                    });
                });
        } catch (err) {
            logger.error(`Error getting feeds for ${category} limit: ${limit} sort: ${sort}`);
            logger.error(err);
        }
    }

    return feeds;
}

module.exports = {
    getRoutes,
    getFeeds
};
