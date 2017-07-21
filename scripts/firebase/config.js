const firebase = require('firebase-admin');
const serviceAccount = require('./rss-to-rest-test-firebase-adminsdk-u8new-15c022041d.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://rss-to-rest-test.firebaseio.com'
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
}