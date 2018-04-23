import * as UserController from '../components/user/userController';
import { ApiError } from '../utils/errors/apiError';
import { HTTP_ERRORS } from '../utils/errors/errorsEnum';

/**
 * Admin Only Middleware - Check if user has admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function adminOnly(req, res, next) {
	// Skip if running tests
	if (process.env.NODE_ENV === 'test') {
		return next();
	}

	try {
		const user = await UserController.getUserById(req.user.id);
		if (user.admin) {
			Object.assign(req.user, user);
			return next();
		}

		return next(new ApiError(HTTP_ERRORS.InsufficientPermissions));
	} catch (err) {
		return next(err);
	}
}

export { adminOnly };
