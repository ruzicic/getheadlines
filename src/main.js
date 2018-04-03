import logger from '../lib/logger';
import * as SourceController from './components/source/sourceController';
import * as JobController from './components/job/jobController';


const initializeApp = async () => {
	const sources = await SourceController.getSourcesWithStatus();
	sources.forEach(JobController.scheduleJob);

	// Log status of each job
	JobController.activeJobs.forEach((job, slug) => {
		const status = job.running ? 'running 🚀' : 'not started ⚠️';
		logger.info(`Job [${slug}] status: ${status}`);
	});
};

export { initializeApp };
