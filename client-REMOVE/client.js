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
	const userToken = document.getElementById('userToken');

	const getUserToken = () => {
		return firebase.auth().currentUser.getToken(true)
			.catch(err => {
				console.error('Error getting user token');
				console.error(err);
			});
	}

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
			console.log(user);
			user.getToken().then(function (accessToken) {
				document.getElementById('sign-in-status').textContent = 'Signed in as ';
				document.getElementById('sign-in-name').textContent = displayName || email;
				// document.getElementById('account-details').textContent = JSON.stringify({
				// 	displayName: displayName,
				// 	email: email,
				// 	emailVerified: emailVerified,
				// 	photoURL: photoURL,
				// 	uid: uid,
				// 	// accessToken: accessToken,
				// 	providerData: providerData
				// }, null, '  ');
			});

			// Display user token
			getUserToken().then(token => {
				userToken.value = token;
			});
		} else {
			// User is signed out.
			document.getElementById('sign-in-status').textContent = 'Signed out ';
			document.getElementById('sign-in-name').textContent = '';
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

	/** 
	 * Copy to clipboard
	 * 
	 */
	const copy = e => {
		// find target
		const clickTarget = e.target;
		const hasCopytarget = clickTarget.dataset.copytarget;
		const inputVal = hasCopytarget ? document.querySelector(hasCopytarget) : null;

		// Is element selectable?
		if (inputVal && inputVal.select) {

			// select text
			inputVal.select();

			try {
				// copy text
				document.execCommand('copy');
				inputVal.blur();

				// copied notification animation
				clickTarget.classList.add('copied');
				setTimeout(() => clickTarget.classList.remove('copied'), 1500);

			} catch (err) {
				alert('Please press CTRL/CMD+C to copy');
			}
		}
	};

	document.body.addEventListener('click', copy, true);


};

window.addEventListener('load', () => {
	init();
});
