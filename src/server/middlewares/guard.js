import { verifyToken } from '../components/auth/authController';
import { ApiError } from '../utils/errors/apiError';
import { HTTP_ERRORS } from '../utils/errors/errorsEnum';

/**
 * Find JSON Web token in request header/body/query
 * @param {Object} req - Express request object
 * @returns {String|null} token
 */
function getToken(req) {
	switch (true) {
	// Handle token from Authorization header
	case (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'):
		return req.headers.authorization.split(' ')[1];

	// Handle token presented as URI param
	case (req.query && req.query.token):
		return req.query.token;

	// Handle token from request body
	case (req.method === 'POST' && req.body.token):
		return req.body.token;

	// Return null if not found
	default:
		return null;
	}
}

/**
 * Guard Middleware - Validate Authorization token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function guard(req, res, next) {
	const token = getToken(req);

	if (!token) {
		return next(new ApiError(HTTP_ERRORS.ApiKeyMissing));
	}

	try {
		const decodedToken = await verifyToken(token);
		req.user = {};
		req.user.id = decodedToken.data;

		return next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return next(new ApiError(HTTP_ERRORS.ApiKeyExpired));
		}

		return next(new ApiError(HTTP_ERRORS.ApiKeyInvalid));
	}
}

export { guard };
