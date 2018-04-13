import logger from '../../../lib/logger';
import * as UserSchema from './userSchema';
import * as UserController from './userController';
import { formatSchemaErrors } from '../../utils/schema';

const get = async (req, res) =>
	res.status(200);

const add = async (req, res) => {
	const valid = UserSchema.validate(req.body);

	// Validate request body using JSON schema
	if (!valid) {
		return res
			.status(422)
			.json({
				status: 'error',
				code: 'invalidSourceObject',
				message: formatSchemaErrors(UserSchema.validate.errors),
			})
			.end();
	}

	// Check if user with provided email already exist
	const sourceExist = await UserController.checkUserExist(req.body.email);
	if (sourceExist) {
		return res
			.status(409)
			.json({
				status: 'error',
				code: 'userAlreadyExist',
				message: `User with email "${req.body.email}" already exist.`,
			})
			.end();
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
		logger.error(`[user] add: ${err}`);
		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
};

const remove = async (req, res) =>
	res.status(200);

export {
	get,
	add,
	remove,
};
