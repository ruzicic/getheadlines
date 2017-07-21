const moment = require('moment');
const Cron = require('cron').CronJob;

const logger = require('./logger');
const { fetchFeed } = require('./utils');
const { lastFetchTimestamp,
    providerRefreshRate,
    getFetchUri } = require('./firebase');

const scheduleJobs = async (providers) => {
    try {
        for (let provider in providers) {
            // const rate = await providerRefreshRate(provider);
            console.log(providers[provider].uri);
            console.log(await providerRefreshRate(provider));
        }
        // Object.keys(providers).forEach(provider => {
        //     // let last = lastFetchTimestamp(provider);
        //     let rate = providerRefreshRate(provider);
        //     let now = moment();
        //     // let next = last ? last.add(rate, 'minutes') : now;
        //     scheduleNextCronJob(provider, now);
        // })
    } catch (err) {
        logger.error(`Error scheduling jobs`);
        logger.error(err);
    }
}

async function scheduleNextCronJob (provider, time) {
    let fetchUri = await getFetchUri(provider);
    console.log(await getFetchUri(provider));
    // let task = new Cron({
    //     cronTime: time,
    //     onTick: await fetchFeed(fetchUri),
    //     start: false
    // });
    // task.start();
    // console.log(`Next job for ${provider} at ${time}`);
}


module.exports = {
    scheduleJobs
}

