import express from 'express';
import * as UserHandler from './userHandler';

const userRouter = new express.Router();

// Get User (self)
userRouter.get('/', UserHandler.get);

// Add New User
userRouter.post('/', UserHandler.add);

// Delete User (self)
userRouter.delete('/', UserHandler.remove);

export { userRouter };
