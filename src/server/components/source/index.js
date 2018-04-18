import express from 'express';
import * as SourceHandler from './sourceHandler';
import { validateSchema } from '../../middlewares/validateSchema';

const sourceRouter = new express.Router();

// Get All Sources
sourceRouter.get('/', SourceHandler.getAll);

// Add New Source
sourceRouter.post('/', validateSchema('source'), SourceHandler.add);

// Delete Source
sourceRouter.delete('/', SourceHandler.remove);

export { sourceRouter };
