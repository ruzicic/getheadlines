/* eslint-env mocha */

import { expect } from 'chai';
import { pool } from './database';

describe('Database', () => {
	it('Should connect', async () => {
		const working = await pool.query('select now()');

		expect(working.rowCount).to.equal(1);
		expect(working).to.be.an('object');
	});
});
