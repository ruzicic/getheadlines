const Cron = require('cron').CronJob;

const {logger} = require('./logger');
const {addMinutesToDate} = require('./helpers');
const {fetchFeed} = require('./utils');
const {getFetchLogs,
    getProviderDetails,
    saveFeed,
    updateRefreshRecords} = require('./firebase');

const scheduleJobs = async providers => {
	try {
		Object.keys(providers).forEach(async providerName => {
            // Get lastRefresh time for current provider
			const recordsSnap = await getFetchLogs(providerName);
			const records = Object.assign({}, recordsSnap.val());
			const lastRefresh = records.lastRefresh ? records.lastRefresh : null;

            // Get provider details
			const providerDetailsSnap = await getProviderDetails(providerName);
			const providerUri = providerDetailsSnap.val().uri;
			const providerRefreshRate = providerDetailsSnap.val().refreshRate;

            // If not defined elsewhere, schedule job in 1 minute
			let nextJob = addMinutesToDate(new Date(), 1);

            // Check if lastRefresh value exist and it's a valid Date
			if (lastRefresh && Date.parse(lastRefresh)) {
				const suggestedTime = addMinutesToDate(new Date(lastRefresh), providerRefreshRate);

				if (suggestedTime > new Date()) {
					nextJob = suggestedTime;
				}
			}

			let jobData = {
				provider: providerName,
				uri: providerUri,
				jobTime: nextJob,
				refreshRate: providerRefreshRate
			};

			await scheduleNextCronJob(jobData);
		});
	} catch (err) {
		logger.error(`Error scheduling jobs`);
		logger.error(err);
	}
};

function scheduleNextCronJob(data) {
	logger.debug(`[CRON][${data.provider}] next refresh scheduled for: ${data.jobTime}`);

	try {
		return new Cron({
			cronTime: data.jobTime,
			onTick: fetchAndSaveFeed(data),
			start: true
		});
	} catch (err) {
		logger.error(`Error scheduling next cron job`);
		logger.error(err);
	}
}

// Returns a function to prevent Cron Job immediate invoke.
// Will fetches XML feed from URL, parse it to JSON and save to Firebase
function fetchAndSaveFeed(data) {
	return async () => {
		const jsonData = await fetchFeed(data.uri);
		await saveFeed(data.provider, jsonData.feed.entries);
		await updateRefreshRecords(data);

		const providerDetails = Object.assign({}, {
			[data.provider]: {
				uri: data.uri,
				refreshRate: data.refreshRate
			}
		});
		await scheduleJobs(providerDetails);
	};
}

module.exports = {
	scheduleJobs
};
