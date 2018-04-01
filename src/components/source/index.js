import express from 'express';
import * as SourceController from './sourceController';

const sourceRouter = new express.Router();

// Get All Sources
sourceRouter.get('/', SourceController.getAll);

// Add New Source
sourceRouter.post('/', SourceController.add);

export { sourceRouter };
