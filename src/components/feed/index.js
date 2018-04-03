import express from 'express';
import * as FeedHandler from './feedHandler';

const feedRouter = new express.Router();

// Get Feeds
feedRouter.get('/', FeedHandler.get);

export { feedRouter };
