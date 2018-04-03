import express from 'express';
import { sourceRouter } from '../components/source';
import { jobRouter } from '../components/job';

const router = new express.Router();

router.use('/sources', sourceRouter);
router.use('/jobs', jobRouter);

export { router };
