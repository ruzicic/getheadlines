const logger = require('../logger');
const { firebase, db } = require('./config');
const { addMinutesToDate } = require('../helpers');

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

// Returns lastRefresh and nextRefresh timestamps
const getFetchLogs = async (provider) => {
    try {
        return await getRef(db.refreshTracking)
            .child(provider)
            .once('value', snapshot => {
                return snapshot;
            });
    } catch (err) {
        logger.error(`Error getting fetch logs (timestamps)`);
        logger.error(err);
    }
}

const getProviderDetails = async (provider) => {
    try {
        return await getRef(db.providers)
            .child(provider)
            .once('value', snapshot => {
                return snapshot;
            });
    } catch (err) {
        logger.error(`Error fetching uri for ${provider}`);
        logger.error(err);
    }
}

const saveFeed = async (provider, data) => {
    let duplicatePosts = 0;
    let newPosts = 0;

    try {
        const lastPost = await getRef(db.feeds)
            .child(provider)
            .limitToLast(1)
            .once('value', snap => {
                return snap;
            });

        const lastPostDate = Object.keys(lastPost.val())[0] || null;

        Object.keys(data.items).forEach(async item => {
            newPosts += 1;
            let postPubDate = data.items[item].pubdate || data.items[item].pubDate;
            let post = {
                title: data.items[item].title,
                link: data.items[item].link,
                description: data.items[item].description,
                image: data.items[item].enclosure.url
            }

            // If current post date is older than last post
            // it is saved to database during previous job
            const older = postPubDate < lastPostDate;
            if (older) {
                duplicatePosts += 1;
                newPosts -= 1;
                return
            }

            await getRef(db.feeds)
                .child(provider)
                .child(postPubDate)
                .set(post)
                .catch(err => {
                    logger.error(`Save to Firebase error!`);
                    logger.error(err);
                });
        });

        logger.info(`[${provider}] ${newPosts} new posts (${duplicatePosts} duplicates)`);
    } catch (err) {
        logger.error(`Error saving feed for ${provider}`);
        logger.error(err);
    }
}

const updateRefreshRecords = async (data) => {
    try {
        const { provider, jobTime, refreshRate } = data;
        const next = addMinutesToDate(jobTime, refreshRate);

        await getRef(db.refreshTracking)
            .child(data.provider)
            .update({
                lastRefresh: jobTime,
                nextRefresh: next
            })
    } catch (err) {
        logger.error(`Error updating refresh records`);
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

module.exports = {
    getActiveProviders,
    getFetchLogs,
    getProviderDetails,
    saveFeed,
    updateRefreshRecords,
    createRoutes,
}