const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const request = require('supertest');
const app = require('../server');

describe('GET /books', function () {
    it('return list of books', function () {
        return request(app)
            .get('/api/v1/books')
            .expect(200)
            .expect((res) => {
                console.log("book list >>> " + JSON.stringify(res));
            })
    })
})

describe('POST /books', function () {
    it('should create a new book', function () {
        return request(app)
            .post('/api/v1/books/save')
            .send({
                title: "Test Book",
                description: "Test Description",
                author: "Test Author",
                puplisher: "Test Publisher", // Note the typo in your API field name
                pages: 100,
                storeCode: "TEST1"
            })
            .expect(201)
            .expect((res) => {
                console.log("created book >>> " + JSON.stringify(res.body));
            });
    });
});