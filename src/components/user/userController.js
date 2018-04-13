import { pool } from '../../utils/database';
import logger from '../../../lib/logger';
import { getCurrentTime } from '../../utils';

/**
 * Check if User with provided email already exist in database
 *
 * @method checkUserExist
 * @param {String} email
 * @return {Boolean}
 */
const checkUserExist = async (email) => {
	try {
		const result = await pool.query(
			'SELECT exists( SELECT true FROM users WHERE email = ($1))',
			[email],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error('[checkUserExist]', err);
	}

	return false;
};

/**
 * Get User By Email
 *
 * @method getUserByEmail
 * @param {String} email
 * @return {Object} User
 */
const getUserByEmail = async (email) => {
	let result = [];

	try {
		result = await pool.query(
			'SELECT * FROM users WHERE email = ($1)',
			[email],
		);

		return result.rows[0];
	} catch (err) {
		logger.error('[getUserByEmail]', err);
	}

	return result;
};

/**
 * Get User By Id
 *
 * @method getUserById
 * @param {String} id
 * @return {Object} User
 */
const getUserById = async (id) => {
	let result = [];

	try {
		result = await pool.query(
			'SELECT * FROM users WHERE id = ($1)',
			[id],
		);

		return result.rows[0];
	} catch (err) {
		logger.error('[getUserById]', err);
	}

	return result;
};

/**
 * Add new User
 *
 * @method addUser
 * @param {Object} user
 * @return {Object} New user
 */
const addUser = async (user) => {
	const now = getCurrentTime();

	try {
		const result = await pool.query(`
			INSERT INTO users
				(name, email, password, registered)
			VALUES
				($1, $2, $3, $4)
			RETURNING *
		`, [
			user.name,
			user.email,
			user.password,
			now,
		]);

		logger.info('[addUser]', result.rows[0]);

		return result.rows[0];
	} catch (err) {
		logger.error('[addUser]', err);
		throw new Error(`Could not add user ${user.email}`);
	}
};

export {
	checkUserExist,
	getUserByEmail,
	getUserById,
	addUser,
};
