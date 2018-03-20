// import * as Provider from '../controllers/provider';
import logger from '../../../lib/logger';
import { validateProvider } from '../../../lib/models';

const getAllProviders = async (req, res) => {
	try {
		const providers = ['first', 'second'];
		logger.info('[getAllProviders]', 'Return data for all providers');
		return res.status(200).json({
			providers,
		}).end();
	} catch (err) {
		logger.error('[getAllProviders]', err);
		return res.status(500).end();
	}
};

const getProviderById = async (req, res) => {
	try {
		const { providerId } = req.params;
		logger.info('[getProvider]', `Return data for provider ${providerId}`);
		return res.status(200).json({
			providerId,
		}).end();
	} catch (err) {
		logger.error('[getProvider]', err);
		return res.status(500).end();
	}
};

const createProvider = async (req, res) => {
	const valid = validateProvider(req.body);

	if (!valid) {
		return res.status(400).end();
	}

	try {
		const tempNewProvider = req.body;
		logger.info('[createProvider]', tempNewProvider);
		return res.status(201).json({
			created: tempNewProvider,
		}).end();
	} catch (err) {
		logger.error('[createProvider]', err);
		return res.status(500).end();
	}
};

const updateProvider = async (req, res) => {
	try {
		const { providerId } = req.params;
		const tempUpdatedProvider = req.body;
		logger.info(`[updateProvider] with id ${providerId}`, tempUpdatedProvider);
		return res.status(200).json({
			updated: tempUpdatedProvider,
		}).end();
	} catch (err) {
		logger.error('[updateProvider]', err);
		return res.status(500).end();
	}
};

const deleteProvider = async (req, res) => {
	try {
		const { providerId } = req.params;
		logger.info('[deleteProvider]', providerId);
		return res.status(200).json({
			deleted: providerId,
		}).end();
	} catch (err) {
		logger.error('[deleteProvider]', err);
		return res.status(500).end();
	}
};

export {
	getAllProviders,
	getProviderById,
	createProvider,
	updateProvider,
	deleteProvider,
};
