import express from 'express';
import * as FeedHandler from './feedHandler';
import { paginateFeeds } from '../../middlewares/pagination';
import { guard } from '../../middlewares/guard';

const feedRouter = new express.Router();

// Get Feeds
feedRouter.get('/', guard, paginateFeeds, FeedHandler.get);

export { feedRouter };
