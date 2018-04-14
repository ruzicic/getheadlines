import { expect } from 'chai';
import { pool } from './database';

describe('Database', () => {
	it('Should connect to database', async () => {
		const working = await pool.query('select now()');

		expect(working.rowCount).to.equal(1);
		expect(working).to.be.an('object');
	});
});
