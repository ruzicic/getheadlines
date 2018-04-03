import express from 'express';
import { sourceRouter } from '../components/source';
import { jobRouter } from '../components/job';
import { feedRouter } from '../components/feed';

const router = new express.Router();

router.use('/sources', sourceRouter);
router.use('/jobs', jobRouter);
router.use('/feeds', feedRouter);

export { router };
