import express from 'express';
import * as SourceHandler from './sourceHandler';

const sourceRouter = new express.Router();

// Get All Sources
sourceRouter.get('/', SourceHandler.getAll);

// Add New Source
sourceRouter.post('/', SourceHandler.add);

export { sourceRouter };
