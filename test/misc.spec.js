import { expect } from 'chai';
import request from 'supertest';
import app from '../src/config/express';

describe('Health Check', () => {
	describe('GET /api/health-check', () => {
		it('Should get 200', (done) => {
			request(app)
				.get('/api/health-check')
				.expect(200)
				.expect((res) => {
					expect(res.text).to.be.equal('OK');
					expect(res.headers).to.haveOwnProperty('x-ratelimit-limit');
					expect(res.headers).to.haveOwnProperty('x-ratelimit-remaining');
					expect(res.headers).to.haveOwnProperty('access-control-allow-origin');
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
