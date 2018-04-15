import express from 'express';
import { sourceRouter } from '../components/source';
import { feedRouter } from '../components/feed';

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));
router.use('/sources', sourceRouter);
router.use('/feeds', feedRouter);
// router.use('/jobs', jobRouter);
// router.use('/user', userRouter);

export { router };
