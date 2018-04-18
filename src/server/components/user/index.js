import express from 'express';
import * as UserHandler from './userHandler';
import { guard } from '../../middlewares/guard';
import { validateSchema } from '../../middlewares/validateSchema';

const userRouter = new express.Router();

// Add New User
userRouter.post('/', validateSchema('user'), UserHandler.add);

// Get User (self)
userRouter.get('/', guard, UserHandler.getSelf);

// Get User by id
userRouter.get('/:id', guard, UserHandler.get);

// Delete User (self)
userRouter.delete('/', guard, UserHandler.removeSelf);

export { userRouter };
