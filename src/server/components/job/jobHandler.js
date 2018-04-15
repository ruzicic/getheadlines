// import logger from '../../../lib/logger';
import * as JobController from './jobController';

/**
 * Returns list of Cron Jobs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function getAll(req, res, next) {
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
		return next(err);
	}
}

export { getAll };
