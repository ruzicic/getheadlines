import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { router } from './routes';
import * as ErrorHandler from './utils/errors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');

// Routes
app.use('/api', router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Development error handler - will print stacktrace
if (config.util.getEnv('NODE_ENV') === 'development') {
	app.use(ErrorHandler.dev);
}

// Production error handler
app.use(ErrorHandler.prod);

export { app };
