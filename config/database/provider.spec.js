/* eslint-env mocha */

import 'babel-polyfill';
import { expect } from 'chai';
import db from '../../models';

const PROVIDER_MOCK = {
	name: 'Mocha',
	active: true,
	url: 'https://',
	language: 'english',
	category: '-',
	refreshRate: 60,
};

describe('Database: Provider Model', () => {
	before(async () => {
		await db.sequelize.sync({ force: true });
	});

	it('Should create provider', async () => {
		const provider = await db.Provider.create(PROVIDER_MOCK);

		expect(provider).to.be.an('object');
		expect(provider.name).to.equal(PROVIDER_MOCK.name);
	});

	it('Should find provider', async () => {
		const provider = await db.Provider.findOne({
			where: {
				name: PROVIDER_MOCK.name,
			},
		});

		expect(provider).to.be.an('object');
		expect(provider.name).to.equal(PROVIDER_MOCK.name);
	});

	it('Should delete provider', async () => {
		const deleted = await db.Provider.destroy({
			where: {
				name: PROVIDER_MOCK.name,
			},
		});

		// Model.destroy() returns number of deleted items
		expect(deleted).to.be.equal(1);
	});

	it('Should NOT find provider', async () => {
		const provider = await db.Provider.findOne({
			where: {
				name: PROVIDER_MOCK.name,
			},
		});

		// eslint-disable-next-line no-unused-expressions
		expect(provider).to.be.null;
	});
});
