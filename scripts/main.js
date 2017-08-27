const {getActiveProviders, createRoutes} = require('./firebase');
const {scheduleJobs} = require('./jobs');
const {scheduleClearJobs} = require('./clearJobs');

const initializeApp = async () => {
	const activeProviders = await getActiveProviders();
	await createRoutes(activeProviders);
	await scheduleJobs(activeProviders);

	// Clear feed data older than 3 days, once a day
	await scheduleClearJobs(activeProviders);
};

module.exports = {
	initializeApp
};
