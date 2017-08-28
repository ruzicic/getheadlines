const {firebase} = require('./config');
const {logger} = require('../logger');

// Firebase Database reference names
const db = {
	providers: '/providers',
	routes: '/routes',
	feeds: '/feeds',
	refreshTracking: '/tracking/updates'
};

// Provided with Firebase database name, 
// will return its Firebase database reference
const getRef = name => {
    try {
        return firebase.database().ref(name);
    } catch (err) {
        logger.error(`Error getting firebase reference for: ${name}`);
		logger.error(err);
    }
} 

module.exports = {
    db,
    getRef,
    firebase
};
