import express from 'express';
import * as JobHandler from './jobHandler';

const jobRouter = new express.Router();

// Get All Active Jobs
jobRouter.get('/', JobHandler.getAll);

// Stop the job
// jobRouter.delete('/', SourceHandler.stop);

export { jobRouter };
