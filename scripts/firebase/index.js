const logger = require('../logger');
const {firebase, db} = require('./config');

// Returns reference to firebase database
const getRef = name => firebase.database().ref(name);

// Returns all active feed providers from firebase database
const getActiveProviders = async () => {
	let activeProviders = {};

	try {
		await getRef(db.providers)
            .orderByKey()
            .once('value', snapshot => {
	snapshot.forEach(provider => {
                    // Return only active providers
		if (!provider.val().active) {
			return;
		}
		activeProviders[provider.key] = {
			active: Boolean(provider.val().active),
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
};

// Returns lastRefresh and nextRefresh timestamps
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

// Returns provider details: active, category, refreshRate, uri
const getProviderDetails = provider => {
	try {
		return getRef(db.providers)
            .child(provider)
            .once('value');
	} catch (err) {
		logger.error(`Error fetching uri for ${provider}`);
		logger.error(err);
	}
};

const saveFeed = (provider, data) => {
	logger.info(`[${provider}] saving ${data.length} posts`);

	try {
		data.forEach(async entry => {
			await getRef(db.feeds)
                .child(provider)
                .child(entry.pubDate)
                .set(entry);
		});
	} catch (err) {
		logger.error(`Error saving feed for ${provider}`);
		logger.error(err);
	}
};

const updateRefreshRecords = data => {
	const {provider, jobTime} = data;

	try {
		return getRef(db.refreshTracking)
            .child(provider)
            .update({
	lastRefresh: jobTime
});
	} catch (err) {
		logger.error(`Error updating refresh records`);
		logger.error(err);
	}
};

// Exposes/ Saves routes to Firebase
// Example route: 'routes/blic/blic-najnovije/'
const createRoutes = async providers => {
	try {
		Object.keys(providers).forEach(async provider => {
			await getRef(`${db.routes}/${providers[provider].category}/${provider}`)
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
	getFetchLogs,
	getProviderDetails,
	saveFeed,
	updateRefreshRecords,
	createRoutes
};
