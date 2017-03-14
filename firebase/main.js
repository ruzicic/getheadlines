const firebase = require('firebase-admin');
const serviceAccount = require('./rss-to-rest-test-firebase-adminsdk-u8new-15c022041d.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: 'https://rss-to-rest-test.firebaseio.com'
});

const dbRefs = {
	providers: '/providers',
	routes: '/routes',
	feeds: '/feeds',
	refreshTracking: '/tracking/updates'
};

const dbRef = name => firebase.database().ref(name);

const providersCached = new Map();

const getProviders = async () => {
	try {
		await dbRef(dbRefs.providers).orderByKey().once('value', snap => {
			snap.forEach(item => {
				providersCached.set(item.key,
					{
						active: Boolean(item.val().active),
						uri: item.val().uri,
						refreshRate: item.val().refreshRate,
						category: item.val().category
					});
			});
		});
	} catch (err) {
		console.error('Error getting providers');
		console.error(err);
	}
};

const createRoutes = async () => {
	try {
		await providersCached.forEach((value, key) => {
			dbRef(`${dbRefs.routes}/${value.category}/${key}`).set({
				name: value.uri
			});
		});
	} catch (err) {
		console.error('Error creating routes');
		console.error(err);
	}
};

const getLastAddedByProvider = async provider => {
	try {
		let lastAddedItem = await firebase.database().ref(`/feeds/${provider}`).limitToLast(1).once('value', snap => {
			return snap;
		});

        // Check if there are any
		if (lastAddedItem.val() === null) {
			return null;
		}
        // naci kako se lakse izvuce key() is firebase objekta
		let itemTitle = Object.getOwnPropertyNames(lastAddedItem.val())[0];
		return new Date(itemTitle).getTime();
	} catch (err) {
		console.error(`Error getLastAddedByProvider ${err}`);
	}
};

const updateRefreshRecords = async provider => {
	try {
		let current = new Date().getTime();
		let refreshInterval = providersCached.get(provider).refreshRate;
		let status = providersCached.get(provider).active;
		let next;

		if (status) {
			next = new Date(current + refreshInterval).getTime();
		} else {
			next = 'Not scheduled - provider not active';
		}

		dbRef(dbRefs.refreshTracking).child(provider).update({
			lastRefresh: current,
			nextRefresh: next
		});
	} catch (err) {
		console.error(`Error updating refresh records`);
		console.error(err);
	}
};

const saveToFirebase = async (provider, data) => {
	try {
		let lastAddedDate = await getLastAddedByProvider(provider);
		let itemCounter = 0;
		let duplicateItemCounter = 0;

		Object.keys(data).forEach(item => {
			let date = new Date(data[item].pubDate);
			itemCounter++;

            // Check if item was already added
			if (lastAddedDate && (lastAddedDate > date.getTime())) {
				duplicateItemCounter++;
                // console.log(`Item already exist? ${data[item].title}. - saved previously on ${lastAddedDate}`);
				return;
			}

			firebase.database().ref(`${dbRefs.feeds}/${provider}/${date}`).set(
				{
					title: data[item].title,
					link: data[item].link,
					guid: data[item].guid,
					description: data[item].description
				})
                .catch(err => {
	console.error(`Save to firebase error ${err}`);
});
		});

		let totalAdded = itemCounter - duplicateItemCounter;
		console.log(`Saved ${totalAdded} (${duplicateItemCounter} duplicates) items to ${provider}`);
	} catch (err) {
		console.error(`Save to firebase, err in try/catch ${err}`);
	}
};

/**
 * Temporary functionalities below - API testing
 */
const getAvailableProviders = async () => {
	try {
		return await dbRef(dbRefs.providers).once('value', snap => snap);
	} catch (err) {
		console.error('Error getAvailableProviders');
	}
};

const isValidRoute = async (route, subroute) => {
	try {
		return await dbRef(dbRefs.routes).once('value', snap => {
			let validRoute = snap.hasChild(route);
			let validSubRoute = snap.hasChild(`${route}/${subroute}`);

			return validRoute && validSubRoute;
		});
	} catch (err) {
		console.error('Error isValidRoute');
	}
};

const getSomeNews = async path => {
	try {
		return await dbRef(`${dbRefs.feeds}/${path}`).limitToLast(10).once('value', snap => snap.val());
	} catch (err) {
		console.error('Error getSomeNews');
	}
};

module.exports = {
	getProviders,
	createRoutes,
	providersCached,
	updateRefreshRecords,
	saveToFirebase,
	getAvailableProviders,
	isValidRoute,
	getSomeNews
};
