const firebase = require('firebase/app');
require('firebase/auth');

let FBApp;

const config = {
    projectId: "getheadlines-16e96",
    apiKey: 'AIzaSyAGSxT1xuW30LCVxEuxgxZf1nyK1e816vo', // "AIzaSyAhMYzerYXgO4vzp5o7Tf-o19Fr1t34iT8",
    authDomain: "getheadlines-16e96.firebaseapp.com",
    databaseURL: "https://getheadlines-16e96.firebaseio.com"
};

firebase.initializeApp(config);

try {
    FBApp = firebase.app();
} catch (err) {
    console.error('Error loading the Firebase SDK, check the console.');
    console.error(err);
}

module.exports = {
    firebase,
    FBApp
};
