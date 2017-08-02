const fs = require('fs');
const path = require('path');
const firebase = require('firebase-admin');

// Firebase Service Account cofiguration (download your own at Firebase Console)
const firebaseConfig = path.join(__dirname, 'serviceAccountKey.json');

// Firebase database name
const databaseURL = 'https://getheadlines-16e96.firebaseio.com';

// Will be assigned config file path, after validating it exists
let serviceAccount;

// Check if Firebase Service Account config exist
try {
	fs.statSync(firebaseConfig);
	serviceAccount = require(firebaseConfig);
} catch(err) {
	console.error('Firebase serviceAccountKey.json NOT FOUND.');
	console.error('Go to https://firebase.google.com/docs/admin/setup for more info');
	console.error(err);	
}

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: databaseURL
});

// For DEBUG only
// firebase.database.enableLogging(true);

module.exports = {
	firebase
};
