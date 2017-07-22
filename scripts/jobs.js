const Cron = require('cron').CronJob;

const logger = require('./logger');
const { addMinutesToDate } = require('./helpers');
const { fetchFeed } = require('./utils');
const { getFetchLogs,
    getProviderDetails,
    saveFeed,
    updateRefreshRecords } = require('./firebase');

const scheduleJobs = async (providers) => {
    try {
        Object.keys(providers).forEach(async providerName => {
            let recordsSnap = await getFetchLogs(providerName);
            let providerDetailsSnap = await getProviderDetails(providerName);

            let lastRefresh = new Date(recordsSnap.val().lastRefresh);
            let nextRefresh = new Date(recordsSnap.val().nextRefresh);
            let providerUri = providerDetailsSnap.val().uri;
            let providerRefreshRate = providerDetailsSnap.val().refreshRate;

            // If not defined elsewhere, next job is in 1 minute
            let nextJob = addMinutesToDate(new Date(), 1);

            if (nextRefresh && nextRefresh > nextJob) {
                // Next job for this provider is already scheduled
                logger.info(`Job for ${providerName} already scheduled ^^`);
                nextJob = nextRefresh;
            }

            const jobData = {
                provider: providerName,
                uri: providerUri,
                jobTime: nextJob,
                refreshRate: providerRefreshRate
            }

            scheduleNextCronJob(jobData);
        });
    } catch (err) {
        logger.error(`Error scheduling jobs`);
        logger.error(err);
    }
}

function scheduleNextCronJob(data) {
    try {
        const task = new Cron({
            cronTime: data.jobTime,
            onTick: fetchAndSaveFeed(data),
            start: false
        });
        logger.info(`[${data.provider}] next refresh scheduled for: ${data.jobTime}`);

        return task.start();
    } catch (err) {
        logger.error(`Error scheduling next cron job`);
        logger.error(err);
    }
}

function fetchAndSaveFeed(data) {
    return async () => {
        const parser = await fetchFeed(data.uri);

        parser.on('end', async () => {
            const jsonData = parser.done();
            await saveFeed(data.provider, jsonData);
            await updateRefreshRecords(data);
        });
    }
}


module.exports = {
    scheduleJobs
}

