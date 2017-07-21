const { getActiveProviders,
    createRoutes } = require('./firebase');
const { scheduleJobs } = require('./jobs');
const { fetchFeed } = require('./utils');


// 1. Get ACTIVE providers
// 2. Create / Expose API routes
// 3. Schedule 'get feeds' jobs

function initializeApp() {
    getActiveProviders()
        .then(createRoutes)
        .then(scheduleJobs);

    // fetchFeed('http://www.kurir.rs/rss/najnovije-vesti/');
}

module.exports = {
    initializeApp
}