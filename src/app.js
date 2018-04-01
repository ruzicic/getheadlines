import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { router } from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.disable('x-powered-by');

// Routes
app.use('/api', router);

// 404
app.use((req, res) => {
	res.status(404).send({
		status: 404,
		message: 'The requested resource was not found',
	});
});

// 5xx
app.use((err, req, res) => {
	const message = process.env.NODE_ENV === 'production'
		? 'Something went wrong, we\'re looking into it...'
		: err.stack;

	res.status(500).send({
		status: 500,
		message,
	});
});

export { app };
