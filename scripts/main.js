const { getActiveProviders,
    createRoutes } = require('./firebase');
const { scheduleJobs } = require('./jobs');

const initializeApp = () => {
    getActiveProviders()
        .then(createRoutes)
        .then(scheduleJobs);
}

module.exports = {
    initializeApp
}