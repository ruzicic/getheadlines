import '../styles/dashboard.scss';
import { firebase, FBApp } from './firebaseApp.js';
const Clipboard = require('clipboard');

const avatarPlaceholder = 'https://api.adorable.io/avatars/40/abott@adorable.png';

const initAuth = () => {
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userEmailVerified = document.getElementById('userEmailVerified');
    const userID = document.getElementById('userID');
    const userTokenInput = document.getElementById('userToken');
    const signOutButton = document.getElementById('signOut');

    const usersRef = firebase.database().ref('users');

    // Firebase database, users table reference
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Reveal content if user is signed in
            document.body.removeAttribute('unresolved');

            userName.textContent = user.displayName;
            userEmail.textContent = user.email;
            userEmailVerified.textContent = user.emailVerified ? 'Email verified' : 'Email not verified';
            userID.textContent = user.uid;

            // Check if user has image
            if (user.photoURL) {
                userAvatar.src = user.photoURL;
            } else {
                userAvatar.src = avatarPlaceholder;
            }

            // Attach ClipboardJS instance to "copy" api key button
            new Clipboard('#apiKeyCopy');
            signOutButton.addEventListener('click', () => signOut());

            // Get and display user token
            // if getIdToken(true) will force refresh?
            user.getIdToken().then(accessToken => {
                userTokenInput.value = accessToken;

                // Save user data to Database
                usersRef.child(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    provider: user.providerData
                });

            });
        } else {
            // User is not signed in
            window.location.href = '/auth.html';
        }
    }, error => {
        console.log(error);
    });
};

const signOut = () => {
    firebase.auth().signOut().then(() => {
        window.location.href = '/';
    }, err => {
        console.error('Sign Out Error', err);
    });
}

window.addEventListener('load', () => initAuth());
