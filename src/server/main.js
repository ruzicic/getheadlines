import logger from '../config/logger';
import * as SourceController from './components/source/sourceController';
import * as JobController from './components/job/jobController';

const initializeApp = async () => {
	try {
		const sources = await SourceController.getSourcesWithStatus();
		sources.forEach(JobController.scheduleJob);
	} catch (err) {
		logger.error('Could not Initialize App!', err);
		throw err;
	}

	// Log status of each job
	JobController.activeJobs.forEach((job, slug) => {
		const status = job.running ? 'running 🚀' : 'not started ⚠️';
		logger.info(`Job [${slug}] status: ${status}`);
	});
};

export { initializeApp };
