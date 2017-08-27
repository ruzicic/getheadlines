const Cron = require('cron').CronJob;

const {logger} = require('./logger');
const {addMinutesToDate} = require('./helpers');
const {getOldEntries, clearOldEntries} = require('./firebase');

const scheduleClearJobs = async providersArr => {
    try {
        Object.keys(providersArr).forEach(async provider => {
			const oldEntries = await getOldEntries(provider);
			if (oldEntries.length === 0) {
				return;
            }

            scheduleClearJob(provider, oldEntries);
		});
    } catch (err) {
		logger.error(`Error scheduling clear jobs`);
		logger.error(err);
	}
}

// Runs every day at 04:00:00 AM
function scheduleClearJob(provider, oldEntries) {
    let job;

	try {
		job = new Cron({
            cronTime: '00 00 16 * *',
			onTick: clearFeeds(provider, oldEntries),
			start: true
        });
        
        logger.debug(`[CRON][${provider}] clear job status: ${job.running}`);
        return job;
	} catch (err) {
		logger.error(`Error scheduling next clear cron job`);
		logger.error(err);
	}
}

function clearFeeds(provider, oldEntries) {
    return async () => await clearOldEntries(provider, oldEntries);
}

module.exports = {
	scheduleClearJobs	
};
