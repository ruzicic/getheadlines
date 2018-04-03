import express from 'express';
import * as FeedHandler from './feedHandler';
import { paginateFeeds } from '../../middlewares/pagination';

const feedRouter = new express.Router();

// Get Feeds
feedRouter.get('/', paginateFeeds, FeedHandler.get);

export { feedRouter };
