const Cron = require('cron').CronJob;

const {logger} = require('./logger');
const {addMinutesToDate} = require('./helpers');
const {
	fetchFeed, 
	getFullArticles, 
	prepareFeedsForSave
} = require('./utils');
const {
	saveFeed, 
	getFetchLogs,
	updateRefreshRecords
} = require('./firebase');
	
/**
 * Receives single OR array of Provider objects
 * 		providerName: {
 * 			uri: 'url to xml feed',
 * 			refreshRate: integer,
 * 			category: 'category'	
 * 		}
 * and schedules CronJob for provider(s)
 */
const scheduleJobs = async providersArr => {
	try {
		Object.keys(providersArr).forEach(async provider => {
			const recordsSnap = await getFetchLogs(provider);
			const records = Object.assign({}, recordsSnap.val());
			const lastRefresh = records.lastRefresh ? records.lastRefresh : null;

            // If not defined elsewhere, schedule job in 1 minute
			let nextJob = addMinutesToDate(new Date(), 1);

            // Check if lastRefresh value exist and it's a valid Date
			if (lastRefresh && Date.parse(lastRefresh)) {
				const suggestedTime = addMinutesToDate(new Date(lastRefresh), providersArr[provider].refreshRate);

				if (suggestedTime > new Date()) {
					nextJob = suggestedTime;
				}
			}

			let jobData = {
				providerName: provider,
				provider: providersArr[provider],
				jobTime: nextJob
			};

			await scheduleNextCronJob(jobData);
		});
	} catch (err) {
		logger.error(`Error scheduling jobs`);
		logger.error(err);
	}
};

function scheduleNextCronJob(jobData) {
	const friendlyDate = new Date(jobData.jobTime).toUTCString();

	logger.debug(`[CRON][${jobData.providerName}] next refresh scheduled for: ${friendlyDate}`);

	try {
		return new Cron({
			cronTime: jobData.jobTime,
			onTick: fetchAndSaveFeed(jobData),
			start: true
		});
	} catch (err) {
		logger.error(`Error scheduling next cron job`);
		logger.error(err);
	}
}

/**
 * Fetches RSS/XML feed from URL, parses it to JSON, saves to Firebase, 
 * and update refreshRecords (lastRefresh time on Firebase)
 * 
 * @param {Object} - providerName, provider, jobTime
 * @return {Function} to prevent Cron Job immediate invoke.
 */
function fetchAndSaveFeed(jobData) {
	return async () => {
		const jsonData = await fetchFeed(jobData.provider.uri);
		const preparedFeed = prepareFeedsForSave(jsonData.feed.entries);
		const feedsWithArticles = await getFullArticles(preparedFeed);

		await saveFeed(jobData.providerName, feedsWithArticles);
		await updateRefreshRecords(jobData.providerName, jobData.jobTime);

		const providerDetails = Object.assign({}, {
			[jobData.providerName]: {
				uri: jobData.provider.uri,
				refreshRate: jobData.provider.refreshRate
			}
		});

		await scheduleJobs(providerDetails);
	};
}

module.exports = {
	scheduleJobs
};
