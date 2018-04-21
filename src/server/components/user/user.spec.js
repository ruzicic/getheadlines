import { expect } from 'chai';
import request from 'supertest';
import app from '../../../config/express';
import * as UserController from './userController';
import { HTTP_ERRORS } from '../../utils/errors/errorsEnum';
import { USER_MOCK } from '../../../../test/mocks';

let token;

function loginUser() {
	return (done) => {
		request(app)
			.post('/api/auth/login')
			.send({
				email: USER_MOCK.email,
				password: USER_MOCK.password,
			})
			.expect(200)
			.end((err, res) => {
				// eslint-disable-next-line prefer-destructuring
				token = res.body.message.token;
				return done();
			});
	};
}

describe('User', () => {
	describe('POST /api/user', () => {
		beforeEach((done) => {
			UserController.deleteUserByEmail(USER_MOCK.email).then(() => done());
		});

		it('Should add new user', (done) => {
			request(app)
				.post('/api/user')
				.send(USER_MOCK)
				.expect(201)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.message.email).to.be.equal(USER_MOCK.email);
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

	describe('GET /api/user', () => {
		before((done) => {
			UserController.deleteUserByEmail(USER_MOCK.email)
				.then(() => UserController.addUser(USER_MOCK)
					.then(() => done()));
		});

		after((done) => {
			UserController.deleteUserByEmail(USER_MOCK.email)
				.then(() => done());
		});

		it('Should require authorization', (done) => {
			request(app)
				.get('/api/user')
				.expect(HTTP_ERRORS.ApiKeyMissing.code)
				.expect((res) => {
					expect(res.body.status).to.be.equal('error');
					expect(res.body.message).to.be.equal(HTTP_ERRORS.ApiKeyMissing.type);
				})
				// eslint-disable-next-line no-unused-vars
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					return done();
				});
		});

		before(loginUser());
		it('Should get user (self)', (done) => {
			request(app)
				.get('/api/user')
				.set('Authorization', `Bearer ${token}`)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.user.name).to.be.equal(USER_MOCK.name);
					expect(res.body.user.email).to.be.equal(USER_MOCK.email);
					expect(res.body.user).to.haveOwnProperty('registered');
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

	describe('DELETE /api/user', () => {
		before((done) => {
			UserController.deleteUserByEmail(USER_MOCK.email)
				.then(() => UserController.addUser(USER_MOCK)
					.then(() => done()));
		});

		before(loginUser());
		it('Should delete user (self)', (done) => {
			request(app)
				.delete('/api/user')
				.set('Authorization', `Bearer ${token}`)
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
