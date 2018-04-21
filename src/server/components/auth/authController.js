import jwt from 'jsonwebtoken';

// Decode JSON Web token
function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (err || !decodedToken) {
				return reject(err);
			}

			return resolve(decodedToken);
		});
	});
}

// Generate JSON Web token with User's Id as payload
function generateToken(userId) {
	const payload = {
		data: userId,
	};

	const options = {
		expiresIn: '7d', // zeit/ms
		algorithm: 'HS256',
	};

	/**
	 * jwt.sign
	 * @param payload
	 * @param secretOrPrivateKey
	 * @param options
	 * @return {String} JSON Web Token
	 */
	return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export {
	verifyToken,
	generateToken,
};
