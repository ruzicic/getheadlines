import config from 'config';
import { expect } from 'chai';
import request from 'supertest';
import app from '../../../config/express';
import * as UserController from '../user/userController';

const USER_MOCK = config.get('mock.user');

describe('Auth', () => {
	before((done) => {
		UserController.deleteUserByEmail(USER_MOCK.email)
			.then(() => UserController.addUser(USER_MOCK)
				.then(() => done()));
	});

	after((done) => {
		UserController.deleteUserByEmail(USER_MOCK.email)
			.then(() => done());
	});

	describe('POST /api/auth/login', () => {
		it('Should login', (done) => {
			request(app)
				.post('/api/auth/login')
				.send({
					email: USER_MOCK.email,
					password: USER_MOCK.password,
				})
				.expect(200)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.message).to.haveOwnProperty('token');
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
