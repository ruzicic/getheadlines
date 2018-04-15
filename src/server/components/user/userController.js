import { pool } from '../../utils/database';
import logger from '../../../config/logger';
import { getCurrentTime } from '../../utils';

/**
 * Check if User with provided email already exist in database
 * @method checkUserExist
 * @param {String} email
 * @return {Promise<Boolean, Error>}
 */
async function checkUserExist(email) {
	try {
		const result = await pool.query(
			'SELECT exists( SELECT true FROM users WHERE email = ($1))',
			[email],
		);

		return result.rows[0].exists;
	} catch (err) {
		logger.error(`Error checking if user "${email}" exist.`, err);
		throw err;
	}
}

/**
 * Get User By Email
 * @method getUserByEmail
 * @param {String} email
 * @return {Promise<Object, Error>} User
 */
async function getUserByEmail(email) {
	try {
		const result = await pool.query(
			'SELECT * FROM users WHERE email = ($1)',
			[email],
		);

		return result.rows[0];
	} catch (err) {
		logger.error(`Error getting user by email "${email}"`, err);
		throw err;
	}
}

/**
 * Get User By Id
 * @method getUserById
 * @param {String} id
 * @return {Promise<Object, Error>} User
 */
async function getUserById(id) {
	try {
		const result = await pool.query(
			'SELECT * FROM users WHERE id = ($1)',
			[id],
		);

		return result.rows[0];
	} catch (err) {
		logger.error(`Error getting user by email "${id}"`, err);
		throw err;
	}
}

/**
 * Add new User
 * @method addUser
 * @param {Object} user
 * @return {Promise<Object, Error>} User
 */
async function addUser(user) {
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

		return result.rows[0];
	} catch (err) {
		logger.error(`Error adding user "${user.email}"`, err);
		throw err;
	}
}

export {
	checkUserExist,
	getUserByEmail,
	getUserById,
	addUser,
};
