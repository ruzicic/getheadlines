import express from 'express';
import { sourceRouter } from '../components/source';

const router = new express.Router();

router.use('/sources', sourceRouter);

export { router };
