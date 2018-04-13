import logger from '../../../lib/logger';
import * as JobController from './jobController';

const getAll = async (req, res) => {
	try {
		let jobs = [];
		JobController.activeJobs.forEach((job, name) => {
			jobs = [...jobs, {
				id: name,
				status: job.running ? 'running' : 'not running',
				started: new Date(job.createdAt).toString(),
			}];
		});

		return res
			.status(200)
			.json({
				status: 'ok',
				jobs,
			})
			.end();
	} catch (err) {
		logger.error(`[job] getAll: ${err}`);
		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
};

export { getAll };
