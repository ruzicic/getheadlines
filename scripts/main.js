const {getActiveProviders, createRoutes} = require('./firebase');
const {scheduleJobs} = require('./jobs');

const initializeApp = async () => {
	const activeProviders = await getActiveProviders();
	await createRoutes(activeProviders);
	await scheduleJobs(activeProviders);
};

module.exports = {
	initializeApp
};
