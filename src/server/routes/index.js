import express from 'express';
import { sourceRouter } from '../components/source';

const router = express.Router();

router.get('/health-check', (req, res) => res.send('OK'));
router.use('/sources', sourceRouter);
// router.use('/jobs', jobRouter);
// router.use('/feeds', feedRouter);
// router.use('/user', userRouter);

export { router };
