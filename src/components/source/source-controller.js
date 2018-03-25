const logger = require('../../../lib/logger');
const Source = require('./source-handler');
const SourceStatus = require('./source-status');
const validateSource = require('./source');

const getAll = async (req, res) => {
	try {
		const sources = await Source.getSources();
		return res
			.status(200)
			.json({
				status: 'ok',
				sources,
			})
			.end();
	} catch (err) {
		logger.error(`[source] getAll: ${err}`);
		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
};

const add = async (req, res) => {
	const valid = validateSource(req.body);

	// Validate request body using JSON schema
	if (!valid) {
		return res
			.status(422)
			.json({
				status: 'error',
				code: 'invalidSourceObject',
				// TODO: https://github.com/epoberezkin/ajv-errors
				message: validateSource.errors,
			})
			.end();
	}

	// Check if source with provided url already exist
	const sourceExist = await Source.checkSourceExist(req.body.url);
	if (sourceExist) {
		return res
			.status(409)
			.json({
				status: 'error',
				code: 'sourceAlreadyExist',
				message: `Source "${req.body.name}" already exist. Id and URL must be unique.`,
			})
			.end();
	}

	try {
		const source = await Source.addSource(req.body);
		await SourceStatus.setInitialSourceStatus(source, req.body.period);

		return res.status(201).json({
			status: 'ok',
			message: {
				id: source.slug,
			},
		}).end();
	} catch (err) {
		logger.error(`[source] getAll: ${err}`);
		return res
			.status(500)
			.json({
				status: 'error',
				code: 'unexpectedError',
			})
			.end();
	}
};

module.exports = { getAll, add };
