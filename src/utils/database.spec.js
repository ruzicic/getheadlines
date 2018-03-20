/* eslint-env mocha */

import { expect } from 'chai';
import { pool } from './database';

const TABLES = {
	providers: 'providers',
	categories: 'categories',
	feeds: 'feeds',
};

const COLUMNS = {
	providers: [
		{ column_name: 'id' },
		{ column_name: 'active' },
		{ column_name: 'language' },
		{ column_name: 'refresh_rate' },
		{ column_name: 'url' },
	],
	categories: [
		{ column_name: 'id' },
		{ column_name: 'name' },
		{ column_name: 'url' },
		{ column_name: 'provider_id' },
	],
	feeds: [
		{ column_name: 'uuid' },
		{ column_name: 'timestamp' },
		{ column_name: 'category_id' },
		{ column_name: 'title' },
		{ column_name: 'content' },
		{ column_name: 'author' },
		{ column_name: 'description' },
		{ column_name: 'pub_date' },
	],
};

describe('Database', () => {
	it('Should connect', async () => {
		const working = await pool.query('select now()');

		expect(working.rowCount).to.equal(1);
		expect(working).to.be.an('object');
	});

	it('Should validate PROVIDER columns', async () => {
		const actualProvidersColumns = await pool.query(`select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '${TABLES.providers}'`);

		expect(actualProvidersColumns.rowCount).to.equal(COLUMNS.providers.length);
		expect(actualProvidersColumns.rows).to.have.deep.members(COLUMNS.providers);
	});

	it('Should validate CATEGORIES columns', async () => {
		const actualCategoriesColumns = await pool.query(`select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '${TABLES.categories}'`);

		expect(actualCategoriesColumns.rowCount).to.equal(COLUMNS.categories.length);
		expect(actualCategoriesColumns.rows).to.have.deep.members(COLUMNS.categories);
	});

	it('Should validate FEEDS columns', async () => {
		const actualFeedsColumns = await pool.query(`select COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = '${TABLES.feeds}'`);

		expect(actualFeedsColumns.rowCount).to.equal(COLUMNS.feeds.length);
		expect(actualFeedsColumns.rows).to.have.deep.members(COLUMNS.feeds);
	});
});
