const firebase = require('firebase/app');
require('firebase/auth');
require('../styles/main.scss');
require.context('../images/', false); // true for subfolders

let app;

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
        app = firebase.app();
        module.exports.FBApp = app;
    } catch (err) {
        console.error('Error loading the Firebase SDK, check the console.');
        console.error(err);
    }
});
