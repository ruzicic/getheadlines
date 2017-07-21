const { firebase, db } = require('./config');
const logger = require('../logger');

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
                    if (!Boolean(provider.val().active)) {
                        return;
                    }
                    activeProviders[provider.key] = {
                        active: Boolean(provider.val().active),
                        uri: provider.val().uri,
                        refreshRate: provider.val().refreshRate,
                        category: provider.val().category
                    }
                });
            });

        return activeProviders;
    } catch (err) {
        logger.error(`Error getting providers`);
        logger.error(err);
    }
}

const getFetchUri = async (provider) => {
    try {
        return await getRef(db.providers)
            .child(provider)
            .once('value', snap => {
                // console.log(snap.val().uri);
                return snap.val().uri;
            });
    } catch (err) {
        logger.error(`Error fetching uri for ${provider}`);
        logger.error(err);
    }
}

// Exposes/ Saves routes to Firebase
// Example route: 'routes/blic/blic-najnovije/'
const createRoutes = async (providers) => {
    try {
        Object.keys(providers).forEach(provider => {
            getRef(`${db.routes}/${providers[provider].category}/${provider}`)
                .set({
                    name: providers[provider].uri
                });
        });

        return providers;
    } catch (err) {
        logger.error(`Error creating routes`);
        logger.error(err);
    }
}

// Returns timestamp of last fetched item for provider
const lastFetchTimestamp = async (provider) => {
    try {
        await getRef(db.refreshTracking)
            .child(provider)
            .once('value', snap => {
                return snap.val().lastRefresh;
            })
    } catch (err) {
        logger.error(`Error getting last fetch timestamp for ${provider}`);
        logger.error(err);
    }
}

// Returns refresh rate for provider
const providerRefreshRate = async (provider) => {
    try {
        return await getRef(db.providers)
            .child(provider)
            .once('value', snap => {
                return snap.val().refreshRate;
            })
    } catch (err) {
        logger.error(`Error getting provider refresh rate for ${provider}`);
        logger.error(err);
    }
}

// Save timestamp of last fetch for provider
const logFetchDetails = async () => {
    try {
        //
    } catch (err) {
        logger.error(`Error logging fetch details`);
        logger.error(err);
    }
}

module.exports = {
    getActiveProviders,
    createRoutes,
    getFetchUri,
    lastFetchTimestamp,
    providerRefreshRate
}