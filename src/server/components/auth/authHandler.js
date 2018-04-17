import bcrypt from 'bcrypt';
import logger from '../../../config/logger';
import * as AuthSchema from './authSchema';
import * as UserController from '../user/userController';
import { generateToken } from './authController';
import { ApiError } from '../../utils/errors/apiError';
import HTTP_ERRORS from '../../utils/errors/errorsEnum';

/**
 * Login user and return token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {*}
 */
async function login(req, res, next) {
	// Check if both email and password exist
	if (!req.body.email || !req.body.password) {
		return next(new ApiError(HTTP_ERRORS.parameterMissing));
	}

	// Validate request body using JSON schema
	const valid = AuthSchema.validate(req.body);
	logger.error('[AuthSchema]', AuthSchema.validate.errors);
	if (!valid) {
		return next(new ApiError(HTTP_ERRORS.parameterInvalid));
	}

	// Check if user with provided emai exist
	try {
		const userExist = await UserController.checkUserExist(req.body.email);
		if (!userExist) {
			return next(new ApiError(HTTP_ERRORS.userNotFound));
		}
	} catch (err) {
		logger.error(`Could not check if user with email "${req.body.email}" exist`, err);
		return next(err);
	}

	// Get user from db
	let user;
	try {
		user = await UserController.getUserByEmail(req.body.email);
	} catch (err) {
		logger.error(`Could not get user with email "${req.body.email}"`, err);
		return next(err);
	}

	// Check if provided password is valid
	try {
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return next(new ApiError(HTTP_ERRORS.invalidPassword));
		}
	} catch (err) {
		logger.error('Could not compare hashed password', err);
		return next(err);
	}

	// From now on we'll identify the user by the id and
	// the id is the only personalized value that goes into the token
	const token = generateToken(user.id);
	return res.status(200).json({
		status: 'ok',
		message: {
			token,
		},
	}).end();
}

export { login };
