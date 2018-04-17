import logger from '../../../config/logger';
import * as UserSchema from './userSchema';
import * as UserController from './userController';
import { ApiError } from '../../utils/errors/apiError';
import HTTP_ERRORS from '../../utils/errors/errorsEnum';

/**
 * Get user by email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function get(req, res, next) {
	const { email } = req.query;

	// Check if email is provided in res.query
	if (!email) {
		return next(new ApiError(HTTP_ERRORS.badRequest));
	}

	try {
		const { name, registered } = await UserController.getUserByEmail(email);

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
 * Add new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function add(req, res, next) {
	const valid = UserSchema.validate(req.body);

	// Validate request body using JSON schema
	if (!valid) {
		// formatSchemaErrors(UserSchema.validate.errors)
		return next(new ApiError(HTTP_ERRORS.parameterInvalid));
	}

	// Check if user with provided email already exist
	try {
		const userExist = await UserController.checkUserExist(req.body.email);
		if (userExist) {
			return next(new ApiError(HTTP_ERRORS.alreadyExist));
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
 * Delete User by url
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function remove(req, res, next) {
	const { email } = req.query;

	// Check if email is provided in res.query
	if (!email) {
		return next(new ApiError(HTTP_ERRORS.badRequest));
	}

	// Check if user with provided email exist
	try {
		const userExist = await UserController.checkUserExist(email);
		if (!userExist) {
			return next(new ApiError(HTTP_ERRORS.userNotFound));
		}
	} catch (err) {
		return next(err);
	}

	try {
		await UserController.deleteUserByEmail(email);
		return res.status(200).json({
			status: 'ok',
			message: `User with email "${email}" deleted.`,
		}).end();
	} catch (err) {
		return next(err);
	}
}

export {
	get,
	add,
	remove,
};
