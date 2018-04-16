import { expect } from 'chai';
import request from 'supertest';
import app from '../../../config/express';
import * as UserController from './userController';

const MOCK = {
	name: 'TEST_USER',
	email: 'test@user.com',
	password: 'qwerty12345',
};

describe('User', () => {
	describe('POST /api/user', () => {
		beforeEach((done) => {
			UserController.deleteUserByEmail(MOCK.email).then(() => done());
		});

		it('Should add new user', (done) => {
			request(app)
				.post('/api/user')
				.send(MOCK)
				.expect(201)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.message.email).to.be.equal(MOCK.email);
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
		beforeEach((done) => {
			UserController.deleteUserByEmail(MOCK.email)
				.then(() => UserController.addUser(MOCK)
					.then(() => done()));
		});

		it('Should get user', (done) => {
			request(app)
				.get('/api/user')
				.query({ email: MOCK.email })
				.expect(200)
				.expect((res) => {
					expect(res.body.status).to.be.equal('ok');
					expect(res.body.user.name).to.be.equal(MOCK.name);
					expect(res.body.user.email).to.be.equal(MOCK.email);
					expect(res.body.user).to.haveOwnProperty('id');
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
		beforeEach((done) => {
			UserController.deleteUserByEmail(MOCK.email)
				.then(() => UserController.addUser(MOCK)
					.then(() => done()));
		});

		it('Should delete user', (done) => {
			request(app)
				.delete('/api/user')
				.query({ email: MOCK.email })
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
