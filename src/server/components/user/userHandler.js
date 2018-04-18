import logger from '../../../config/logger';
import * as UserController from './userController';
import { ApiError } from '../../utils/errors/apiError';
import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';
import { isNumber } from '../../utils';

/**
 * Add new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function add(req, res, next) {
	// Check if user with provided email already exist
	try {
		const userExist = await UserController.checkUserEmailExist(req.body.email);
		if (userExist) {
			return next(new ApiError(HTTP_ERRORS.AlreadyExist));
		}
	} catch (err) {
		logger.error(`Could not check if "${req.body.email}" exist`, err);
		return next(err);
	}

	try {
		const user = await UserController.addUser(req.body);

		return res.status(201).json({
			status: 'ok',
			message: {
				email: user.email,
			},
		}).end();
	} catch (err) {
		logger.error(`Could not add user "${req.body.email}"`, err);
		return next(err);
	}
}

/**
 * Get user (self)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function getSelf(req, res, next) {
	// Id is attached by guard middleware to req.user object
	const { id } = req.user;
	if (!isNumber(id)) {
		logger.warn('[get.user] Somehow guard was passed without req.user!', req);
		return next(new ApiError(HTTP_ERRORS.BadRequest));
	}

	try {
		const { name, email, registered } = await UserController.getUserById(id);

		return res
			.status(200)
			.json({
				status: 'ok',
				user: {
					name,
					email,
					registered,
				},
			})
			.end();
	} catch (err) {
		return next(err);
	}
}

/**
 * Get user by id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function get(req, res, next) {
	// Validate id from query
	const { id } = req.query;
	if (!isNumber(id)) {
		return next(new ApiError(HTTP_ERRORS.ParameterInvalid));
	}

	// Check if user exist
	try {
		const userExist = await UserController.checkUserIdExist(id);
		if (!userExist) {
			return next(new ApiError(HTTP_ERRORS.UserNotFound));
		}
	} catch (err) {
		return next(err);
	}

	try {
		const { name, email, registered } = await UserController.getUserById(id);

		return res
			.status(200)
			.json({
				status: 'ok',
				user: {
					name,
					email,
					registered,
				},
			})
			.end();
	} catch (err) {
		return next(err);
	}
}

/**
 * Delete User (self)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function removeSelf(req, res, next) {
	// Id is attached by guard middleware to req.user object
	const { id } = req.user;
	if (!isNumber(id)) {
		logger.warn('[get.user] Somehow guard was passed without req.user!', req);
		return next(new ApiError(HTTP_ERRORS.BadRequest));
	}

	// Check if user exist
	try {
		const userExist = await UserController.checkUserIdExist(id);
		if (!userExist) {
			return next(new ApiError(HTTP_ERRORS.UserNotFound));
		}
	} catch (err) {
		return next(err);
	}

	try {
		await UserController.deleteUser(id);
		return res.status(200).json({
			status: 'ok',
			message: `User with id "${id}" deleted.`,
		}).end();
	} catch (err) {
		return next(err);
	}
}

export {
	add,
	getSelf,
	get,
	removeSelf,
};
