const {firebase, db} = require('./config');
const {logger} = require('../logger');

// Provided with Firebase database name, 
// will return its Firebase reference
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
    getRef
};
