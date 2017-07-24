const firebase = require('firebase-admin');
const serviceAccount = require('./getheadlines-16e96-firebase-adminsdk-uw9yt-22fbcb74eb.json');

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: 'https://getheadlines-16e96.firebaseio.com'
});

// Firebase Database reference names
const db = {
	providers: '/providers',
	routes: '/routes',
	feeds: '/feeds',
	refreshTracking: '/tracking/updates'
};

module.exports = {
	firebase,
	db
};
