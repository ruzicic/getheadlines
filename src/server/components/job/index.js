import express from 'express';
import * as JobHandler from './jobHandler';
import { guard } from '../../middlewares/guard';
import { adminOnly } from '../../middlewares/adminOnly';

const jobRouter = new express.Router();

// Get All Active Jobs
jobRouter.get('/', guard, adminOnly, JobHandler.getAll);

// TODO: Add stop/restart job
// Stop the job
// jobRouter.delete('/', SourceHandler.stop);

export { jobRouter };
