const init = () => {
	const config = {
		apiKey: 'AIzaSyBOe2dAFVNtIYDteJPirCD1uXBKllN2B3A',
		authDomain: 'rss-to-rest-test.firebaseapp.com',
		databaseURL: 'https://rss-to-rest-test.firebaseio.com',
		storageBucket: 'rss-to-rest-test.appspot.com',
		messagingSenderId: '480526636126'
	};

	firebase.initializeApp(config);

	const btnLogin = document.getElementById('btnLogin');
	const btnLogout = document.getElementById('btnLogout');

	firebase.auth().onAuthStateChanged(user => {
		if (user) {
            // User is signed in.
			btnLogout.classList.remove('hidden-sm-up');
			btnLogin.classList.add('hidden-sm-up');
			const displayName = user.displayName;
			const email = user.email;
			const emailVerified = user.emailVerified;
			const photoURL = user.photoURL;
			const uid = user.uid;
			const providerData = user.providerData;
			user.getToken().then(function (accessToken) {
				document.getElementById('sign-in-status').textContent = 'Signed in';
				document.getElementById('sign-in').textContent = 'Sign out';
				document.getElementById('account-details').textContent = JSON.stringify({
					displayName: displayName,
					email: email,
					emailVerified: emailVerified,
					photoURL: photoURL,
					uid: uid,
					accessToken: accessToken,
					providerData: providerData
				}, null, '  ');
			});
		} else {
            // User is signed out.
			document.getElementById('sign-in-status').textContent = 'Signed out';
			document.getElementById('sign-in').textContent = 'Sign in';
			document.getElementById('account-details').textContent = 'null';
			btnLogout.classList.add('hidden-sm-up');
			btnLogin.classList.remove('hidden-sm-up');
		}
	}, err => {
		console.log(err);
	});

    // logout
	btnLogout.addEventListener('click', () => {
		firebase.auth().signOut();
	});

	btnLogin.addEventListener('click', () => {
		window.location.href = '/auth.html';
	});

    // const preObject = document.getElementById('object');
    // const ulList = document.getElementById('list');

    // // DB References
    // // ref() = database root
    // const dbRefObject = firebase.database().ref().child('object');
    // const dbRefList = dbRefObject.child('tata');

    // // Sync
    // dbRefObject.on('value', snap => {
    //     preObject.innerText = JSON.stringify(snap.val(), null, 3);
    // });

    // dbRefList.on('child_added', snap => {
    //     const li = document.createElement('li');
    //     li.innerText = snap.val();
    //     li.id = snap.key;
    //     ulList.appendChild(li);
    // });

    // dbRefList.on('child_changed', snap => {
    //     const liChanged = document.getElementById(snap.key);
    //     liChanged.innerText = snap.val();
    // });

    // dbRefList.on('child_removed', snap => {
    //     const liToRemove = document.getElementById(snap.key);
    //     liToRemove.remove();
    // });
};

window.addEventListener('load', () => {
	init();
});
