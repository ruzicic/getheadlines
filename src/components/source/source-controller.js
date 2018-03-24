const logger = require('../../../lib/logger');
const Source = require('./source-handler');
const validate = require('./source');

const getAll = async (req, res) => {
	try {
		const sources = await Source.getSources();
		return res.status(200).json({
			status: 'ok',
			sources,
		}).end();
	} catch (err) {
		logger.error(`[source] getAll: ${err}`);
		return res.status(500).end();
	}
};

const add = async (req, res) => {
	const valid = validate(req.body);

	if (!valid) {
		return res.status(422).json({
			status: 'error',
			code: 'Invalid Source Object',
			// TODO: https://github.com/epoberezkin/ajv-errors
			message: validate.errors,
		}).end();
	}

	const sourceExist = await Source.checkSourceExist(req.body.url);
	if (sourceExist) {
		return res.status(409).json({
			status: 'error',
			message: 'Source already exist',
		}).end();
	}

	try {
		const source = await Source.addSource(req.body);

		return res.status(201).json({
			status: 'ok',
			source,
		}).end();
	} catch (err) {
		logger.error(`[source] getAll: ${err}`);
		return res.status(500).end();
	}
};

module.exports = { getAll, add };
