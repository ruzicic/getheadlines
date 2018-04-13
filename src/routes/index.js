import express from 'express';
import { sourceRouter } from '../components/source';
import { jobRouter } from '../components/job';
import { feedRouter } from '../components/feed';
import { userRouter } from '../components/user';

const router = new express.Router();

router.use('/sources', sourceRouter);
router.use('/jobs', jobRouter);
router.use('/feeds', feedRouter);
router.use('/user', userRouter);

export { router };
