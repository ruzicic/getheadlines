import { expect } from 'chai';
import { query } from './database';

describe('Database', () => {
	it('Should connect to database', async () => {
		const working = await query('select now()');

		expect(working.rowCount).to.equal(1);
		expect(working).to.be.an('object');
	});
});
