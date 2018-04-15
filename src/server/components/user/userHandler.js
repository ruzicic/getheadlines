import logger from '../../../config/logger';
import * as UserSchema from './userSchema';
import * as UserController from './userController';
import { ApiError } from '../../utils/errors/apiError';
import HTTP_ERRORS from '../../utils/errors/errorsEnum';

// TODO: Get user by email / id
const get = async (req, res) =>
	res.status(200);

/**
 * Add new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
const add = async (req, res, next) => {
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
};

// TODO: Delete user by email / id
const remove = async (req, res) =>
	res.status(200);

export {
	get,
	add,
	remove,
};
