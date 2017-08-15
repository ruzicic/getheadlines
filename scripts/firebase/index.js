/**
 * PRIVATE methods that will be used by APP itself
 */

const {logger} = require('../logger');
const {db, getRef} = require('./db');

// Returns all active feed providers
const getActiveProviders = async () => {
	let activeProviders = {};

	try {
		await getRef(db.providers)
			.orderByKey()
			.once('value')
			.then(snapshot => {
				snapshot.forEach(provider => {
					if (!provider.val().active) {
						return;
					}
					activeProviders[provider.key] = {
						// active: Boolean(provider.val().active),
						uri: provider.val().uri,
						refreshRate: provider.val().refreshRate,
						category: provider.val().category
					};
				});
			});

		return activeProviders;
	} catch (err) {
		logger.error(`Error getting providers`);
		logger.error(err);
	}
}

// Returns lastRefresh
const getFetchLogs = provider => {
	try {
		return getRef(db.refreshTracking)
            .child(provider)
            .once('value');
	} catch (err) {
		logger.error(`Error getting fetch logs (timestamps)`);
		logger.error(err);
	}
};

const saveFeed = (providerName, data) => {
	logger.info(`[FIREBASE]: ${providerName} saving ${data.length} posts`);

	try {
		data.forEach(async entry => {
			await getRef(db.feeds)
				.child(providerName)
				// FIXME: format date to UTC
                .child(entry.pubDate)
                .set(entry);
		});
	} catch (err) {
		logger.error(`Error saving feed for ${providerName}`);
		logger.error(err);
	}
};

const updateRefreshRecords = (providerName, lastJobTime) => {
	try {
		return getRef(db.refreshTracking)
			.child(providerName)
			.update({
				lastRefresh: lastJobTime
			});
	} catch (err) {
		logger.error(`Error updating refresh records`);
		logger.error(err);
	}
};

// Saves routes to Firebase
// Example route: 'routes/blic/blic-najnovije/'
const createRoutes = async providers => {
	try {
		const routesRef = await getRef(db.routes);

		// Clear old routes
		await routesRef.ref.remove();

		// Save new routes
		Object.keys(providers).forEach(async provider => {
			await routesRef
				.child(`${providers[provider].category}/${provider}`)
				.set({
					name: providers[provider].uri
				});
		});
	} catch (err) {
		logger.error(`Error creating routes`);
		logger.error(err);
	}
};

module.exports = {
	getActiveProviders,
	saveFeed,
	getFetchLogs,
	updateRefreshRecords,
	createRoutes
};
