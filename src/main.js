import cron from 'cron';
import logger from '../lib/logger';
import * as SourceController from './components/source/sourceController';
import * as FeedController from './components/feed/feedController';
import { fetchFeed, getArticleContent } from './services';
import { getCronePattern } from './utils';

const Cron = cron.CronJob;
const activeJobs = new Map();

function fetchAndSaveFeed(source) {
	return async () => {
		const items = await fetchFeed(source.url); // 'https://www.blic.rs/rss/IT'
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
	if (!source.active) {
		logger.info(`Skipping ${source.slug} - not active`);
		return false;
	}

	const cronTime = getCronePattern(source.period);
	let job;

	logger.debug(`[CRON] Schedule job for: ${source.slug}. Active: ${source.active}`);

	try {
		job = new Cron({
			cronTime,
			onTick: fetchAndSaveFeed(source),
			start: true,
		});

		// Save the reference to the job
		activeJobs.set(source.slug, job);

		return job;
	} catch (err) {
		logger.error('Error scheduling next cron job', err);
	}

	return false;
}

const initializeApp = async () => {
	const sources = await SourceController.getSourcesWithStatus();
	sources.forEach(scheduleJob);

	// Log status of each job
	activeJobs.forEach((job, slug) => {
		const status = job.running ? 'running' : 'not started :(';
		logger.info(`Job [${slug}] status: ${status}`);
	});
};

export { initializeApp };
