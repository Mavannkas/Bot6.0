'use strict';

const supertest = require('supertest');
const test = require('unit.js');
const x = require('../dist/app');
const app = x.default;
// console.log(app.default);
const request = supertest(app);

describe('Tests app', function () {
	it('verifies get', function (done) {
		request.get('/').expect(200);
		// .end(function (err, result) {
		// 	test.string(result.body.Output).contains('Hello');
		// 	test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
		// 	done(err);
		// });
	});
	it('verifies post', function (done) {
		request.post('/').expect(200);
		// .end(function (err, result) {
		// 	test.string(result.body.Output).contains('Hello');
		// 	test.value(result).hasHeader('content-type', 'application/json; charset=utf-8');
		// 	done(err);
		// });
	});
});
