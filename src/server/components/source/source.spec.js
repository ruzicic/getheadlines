import { expect } from 'chai';
import request from 'supertest';
import app from '../../../config/express';
import * as SourceController from './sourceController';

const MOCK = {
	name: 'Not Blank',
	description: 'Not Blank',
	slug: 'not-blank',
	homepage: 'https://example.com',
	url: 'https://example.com',
	image: '',
	language: 'sr',
	country: 'sr',
	category: 'general',
	period: 30,
};

describe('Source', () => {
	describe('POST /api/sources', () => {
		beforeEach((done) => {
			SourceController.deleteSource(MOCK.url).then(() => done());
		});

		it('Should add new source', (done) => {
			request(app)
				.post('/api/sources')
				.send(MOCK)
				.expect(201)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.message.id).to.be.equal(MOCK.slug);
				})
				// eslint-disable-next-line no-unused-vars
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					return done();
				});
		});
	});

	describe('DELETE /api/sources', () => {
		beforeEach((done) => {
			SourceController.deleteSource(MOCK.url)
				.then(() => SourceController.addSource(MOCK)
					.then(() => done()));
		});

		it('Should delete source', (done) => {
			request(app)
				.delete('/api/sources')
				.query({ url: MOCK.url })
				.expect(200)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
				})
				// eslint-disable-next-line no-unused-vars
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					return done();
				});
		});
	});
});
