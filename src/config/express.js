import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from '../server/components/auth';
import { router } from '../server/routes';
import { guard } from '../server/middlewares/guard';
import * as ErrorHandler from '../server/middlewares/errorHandler';

const app = express();
const env = process.env.NODE_ENV;

if (env === 'development') {
	app.use(morgan('combined'));
}

// Parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(methodOverride());

// Secure App by setting various HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Auth routes (do not require token to access)
app.use('/api/auth', authRouter);

// Mount all routes on /api path
app.use('/api', guard, router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not found');
	err.status = 404;

	return next(err);
});

// Development error handler - will print stacktrace
if (env === 'development') {
	app.use(ErrorHandler.dev);
}

// Production error handler
app.use(ErrorHandler.prod);

export default app;
