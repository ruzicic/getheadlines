import express from 'express';
import { sourceRouter } from '../components/source';
import { feedRouter } from '../components/feed';
import { jobRouter } from '../components/job';
import { userRouter } from '../components/user';
import { authRouter } from '../components/auth';

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));
router.use('/sources', sourceRouter);
router.use('/feeds', feedRouter);
router.use('/jobs', jobRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
