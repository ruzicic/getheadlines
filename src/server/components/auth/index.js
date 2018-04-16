import express from 'express';
import * as AuthHandler from './authHandler';

const authRouter = new express.Router();

// Login user
authRouter.post('/login', AuthHandler.login);

export { authRouter };
