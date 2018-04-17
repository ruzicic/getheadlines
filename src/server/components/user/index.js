import express from 'express';
import * as UserHandler from './userHandler';
import { guard } from '../../middlewares/guard';

const userRouter = new express.Router();

// Get User (self)
userRouter.get('/', guard, UserHandler.get);

// Add New User
userRouter.post('/', UserHandler.add);

// Delete User (self)
userRouter.delete('/', guard, UserHandler.remove);

export { userRouter };
