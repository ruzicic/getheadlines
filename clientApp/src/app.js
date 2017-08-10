const firebase = require('firebase/app');
require('firebase/auth');
require('./style.scss');
require.context('./assets/images/', false); // true for subfolders

console.log('App.js loaded');

document.addEventListener('DOMContentLoaded', function () {
    document.body.removeAttribute('unresolved');

    const config = {
        projectId: "getheadlines-16e96",
        apiKey: "AIzaSyAhMYzerYXgO4vzp5o7Tf-o19Fr1t34iT8",
        authDomain: "getheadlines-16e96.firebaseapp.com",
        databaseURL: "https://getheadlines-16e96.firebaseio.com"
    };

    firebase.initializeApp(config);

    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        console.log(`Firebase initialized with modules: ${features.join(', ')}`);
    } catch (err) {
        console.error('Error loading the Firebase SDK, check the console.');
        console.error(err);
    }
});
