import express from 'express';
import * as UserHandler from './userHandler';
import { guard } from '../../middlewares/guard';
import { adminOnly } from '../../middlewares/adminOnly';
import { validateSchema } from '../../middlewares/validateSchema';

const userRouter = new express.Router();

// Add New User
userRouter.post('/', validateSchema('user'), UserHandler.add);

// Get User (self)
userRouter.get('/', guard, UserHandler.getSelf);

// Get User by id
userRouter.get('/:userId', guard, adminOnly, UserHandler.get);

/**
 * TODO:
 * - Update User by Id, with validation
 * 1. its admin OR
 * 2. its user editing himself
 * (required User Schema update - optional field 'admin', for promoting admins)
 *
 * - Get All Users
 */


// Delete User (self)
userRouter.delete('/', guard, UserHandler.removeSelf);

export { userRouter };
