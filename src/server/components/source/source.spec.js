import { expect } from 'chai';
// import * as SourceHandler from './sourceHandler';
import * as SourceController from './sourceController';
import { AppError } from '../../utils/errors/appError';

const MOCK = {
	name: 'MOCHA',
	description: 'Mocha test',
	slug: 'mocha-test',
	homepage: 'https://google.rs',
	url: 'https://google.rs',
	language: 'sr',
	country: 'sr',
	category: 'general',
	period: 30,
};

describe('Source', () => {
	// it('Should add new source to database and return it', async () => {
	// 	const source = await SourceController.addSource(MOCK);

	// 	expect(source).to.be.an('object');
	// 	expect(source).to.have.property('id');
	// 	expect(source).to.have.property('slug');
	// 	expect(source).to.have.property('url');
	// });

	it('it should CONFIRM source exist', async () => {
		const exist = await SourceController.checkSourceExist(MOCK.url);

		// eslint-disable-next-line no-unused-expressions
		expect(exist).to.be.true;
	});

	it('it should FAIL TO ADD existing source', (done) => {
		SourceController.addSource(MOCK).then(() => {
			// Should never fullfill
		}, (err) => {
			expect(err).to.be.instanceof(AppError);
			done();
		});
	});
});
