import cron from 'cron';
import * as FeedController from '../feed/feedController';
import { getCronePattern, getCurrentTime } from '../../utils';
import { fetchFeed, getArticleContent } from '../../services';
import logger from '../../../config/logger';

const Cron = cron.CronJob;
const activeJobs = new Map();

function fetchAndSaveFeed(source) {
	return async () => {
		const items = await fetchFeed(source.url);
		const itemsWithContent = [...items]
			.map(async item => Object.assign(item, {
				articleContent: await getArticleContent(item.guid),
			}));

		// Process feed items in parallel
		// TODO: Inspect/Profile for performance issues
		const feeds = await Promise.all(itemsWithContent);
		FeedController
			.saveFeeds(source, feeds)
			.catch(err => logger.error(err));
	};
}

async function scheduleJob(source) {
	// Skip Source if active = false
	if (!source.active) {
		return false;
	}

	const cronTime = getCronePattern(source.period);
	let job;

	try {
		job = new Cron({
			cronTime,
			onTick: fetchAndSaveFeed(source),
			// TODO: This should be pulled from Source DB as auto_start Boolean
			// and exposed post API for starting
			start: true,
		});

		// Nice to have
		Object.assign(job, {
			createdAt: getCurrentTime(),
		});

		// Save the reference to the job
		activeJobs.set(source.slug, job);

		return job;
	} catch (err) {
		logger.error(`Error scheduling cron job for "${source.slug}"`, err);
		throw err;
	}
}

export {
	activeJobs,
	scheduleJob,
};
