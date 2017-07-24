const {getActiveProviders, createRoutes} = require('./firebase');
const {scheduleJobs} = require('./jobs');

const initializeApp = async () => {
	const activeProviders = await getActiveProviders();
	await createRoutes(activeProviders);
	await scheduleJobs(activeProviders);

	// TODO: Create Cron Job (once a day):
	// Clear feed data older than 3 days
};

module.exports = {
	initializeApp
};
