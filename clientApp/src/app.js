const firebase = require('firebase/app');
const Slideout = require('slideout');
require('firebase/auth');
require('./style.scss');
require.context('./assets/images/', false); // true for subfolders

// console.log('App.js loaded');

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
        // console.log(`Firebase initialized with modules: ${features.join(', ')}`);
    } catch (err) {
        console.error('Error loading the Firebase SDK, check the console.');
        console.error(err);
    }

    // Register Slideout.js - off canvas menu
    const mainElem = document.getElementById('main');
    const menuElem = document.getElementById('mobileMenu');
    const toggleButton = document.getElementById('toggleButton');
    const hamburgerMenu = document.getElementsByClassName('hamburger')[0];

    const close = event => {
        event.preventDefault();
        mobileMenu.close();
    }

    const mobileMenu = new Slideout({
        panel: mainElem,
        menu: menuElem,
        padding: 256,
        tolerance: 110,
        side: 'right',
        easing: 'cubic-bezier(.32,2,.55,.27)'
    });

    // Toggle button
    toggleButton.addEventListener('click', () => mobileMenu.toggle());

    // Animate hamburger button & add event listener on main element (to close menu)
    mobileMenu
        .on('beforeopen', () => hamburgerMenu.classList.add('hamburgerActive'))
        .on('open', () => mainElem.addEventListener('click', close))
        .on('beforeclose', () => {
            hamburgerMenu.classList.remove('hamburgerActive');
            mainElem.removeEventListener('click', close);
        });
});
