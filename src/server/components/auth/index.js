import express from 'express';
import * as AuthHandler from './authHandler';
import { validateSchema } from '../../middlewares/validateSchema';

const authRouter = new express.Router();

// Login user
authRouter.post('/login', validateSchema('auth'), AuthHandler.login);

export { authRouter };
