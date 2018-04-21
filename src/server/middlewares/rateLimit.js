import RateLimit from 'express-rate-limit';
import { ApiError } from '../utils/errors/apiError';
import { HTTP_ERRORS } from '../utils/errors/errorsEnum';

const timeWindow = 10 * 60 * 1000; // 10 minute time window
function onMaxLimitExceeded(req, res, next) {
	res.setHeader('Retry-After', Math.ceil(timeWindow / 1000));

	return next(new ApiError(HTTP_ERRORS.RateLimited));
}

const optsDefault = {
	windowMs: timeWindow,
	max: 50, // limit each IP to 50 requests per windowMs
	delayMs: 0, // disable delaying - full speed until the max limit is reached
	headers: true,
	handler: onMaxLimitExceeded,
};

/**
 * A req.rateLimit property is added to all requests with the
 * limit, current, and remaining number of requests for usage.
 */
const defaultRateLimit = new RateLimit(optsDefault);

export { defaultRateLimit };
