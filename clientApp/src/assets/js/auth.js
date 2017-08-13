import '../styles/auth.scss';
import { firebase, FBApp } from './firebaseApp.js';
const firebaseui = require('firebaseui');

const initAuth = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            window.location.href = '/dashboard.html';
        } else {
            // User is not signed in.
            var uiConfig = {
                signInSuccessUrl: 'dashboard.html',
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ]
            };
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }, error => {
        console.log(error);
    });
};

const signOut = () => {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}

window.addEventListener('load', () => initAuth());
