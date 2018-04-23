import express from 'express';
import * as SourceHandler from './sourceHandler';
import { validateSchema } from '../../middlewares/validateSchema';
import { guard } from '../../middlewares/guard';
import { adminOnly } from '../../middlewares/adminOnly';

const sourceRouter = new express.Router();

// Get All Sources
sourceRouter.get('/', guard, SourceHandler.getAll);

// Add New Source
sourceRouter.post('/', guard, adminOnly, validateSchema('source'), SourceHandler.add);

// Delete Source
sourceRouter.delete('/', guard, adminOnly, SourceHandler.remove);

export { sourceRouter };
