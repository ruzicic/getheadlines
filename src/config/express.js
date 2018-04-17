import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';

import routes from '../server/routes';
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

// Mount all routes on /api path
app.use('/api', routes);

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
