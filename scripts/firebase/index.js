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
					const {active, uri, refreshRate, category, language} = provider.val();

					// Skip providers which are not active at the moment
					if (!active) {
						return;
					}

					activeProviders[provider.key] = {
						uri,
						refreshRate,
						category,
						language
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
				.child(entry.timeUTC)
				.set(entry);
		});
	} catch (err) {
		logger.error(`Error saving feed for ${providerName}`);
		logger.error(err);
	}
};

const updateRefreshRecords = (providerName, lastJobTime) => {
	const timeUTC = new Date(lastJobTime).toUTCString();

	try {
		return getRef(db.refreshTracking)
			.child(providerName)
			.update({
				lastRefresh: timeUTC
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
					// name: provider,
					sourceUrl: providers[provider].uri,
					language: providers[provider].language
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
