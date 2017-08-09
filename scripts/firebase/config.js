const path = require('path');
const firebase = require('firebase-admin');

// Firebase database name
const databaseURL = 'https://getheadlines-16e96.firebaseio.com';

// Firebase Service Account cofiguration
// Download your own at Firebase Console
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
let serviceAccount;

try {
	serviceAccount = require(serviceAccountPath);
} catch (err) {
	console.error('Firebase serviceAccountKey.json NOT FOUND.');
	console.error('Go to https://firebase.google.com/docs/admin/setup for more info');
	console.error(err);
	process.exit(1);
}

// Initialize Firebase App
try {
	firebase.initializeApp({
		credential: firebase.credential.cert(serviceAccount),
		databaseURL: databaseURL
	});
} catch (err) {
	console.error('Could not initialize Firebase App.');
	console.error('Go to https://firebase.google.com/docs/reference/admin/node/admin#.initializeApp for more info');
	console.error(err);
	process.exit(1);
}

// For DEBUG only
// firebase.database.enableLogging(true);

module.exports = {
	firebase
};
