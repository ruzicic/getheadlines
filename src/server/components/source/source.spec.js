import { expect } from 'chai';
import request from 'supertest';
import app from '../../../config/express';
import * as SourceController from './sourceController';
import * as UserController from '../user/userController';

const USER_MOCK = {
	name: 'TEST_USER',
	email: 'test@user.com',
	password: 'qwerty12345',
};

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

describe('Source', () => {
	before((done) => {
		UserController.deleteUserByEmail(USER_MOCK.email)
			.then(() => UserController.addUser(USER_MOCK)
				.then(() => done()));
	});
	before(loginUser());

	after((done) => {
		UserController.deleteUserByEmail(USER_MOCK.email)
			.then(() => done());
	});

	describe('POST /api/sources', () => {
		beforeEach((done) => {
			SourceController.deleteSource(MOCK.url).then(() => done());
		});

		it('Should add new source', (done) => {
			request(app)
				.post('/api/sources')
				.set('Authorization', `Bearer ${token}`)
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
				.set('Authorization', `Bearer ${token}`)
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
