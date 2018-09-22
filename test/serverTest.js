const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const mocha = require('mocha');

chai.use(chaiHttp);

it('responds with the current timestamp if date parameter is omitted', function (done) {
  chai.request(server)
    .get('/api/timestamp')
    .then(function (res) {
      expect(res).to.have.status(200);
      expect('Content-Type', /json/);
      expect(typeof res.unix === "number");
      expect(typeof res.utc === "string");
      expect(typeof Date.parse(res.utc) === "number");
      done();
    })
    .catch(function (err) {
      throw err;
    });
});

it('responds with a unix timestamp and UTC date string of the passed date if the date parameter is a valid ISO-8601 date string', function (done) {
  const TEST_DATE = "2015-12-25";
  chai.request(server)
    .get(`/api/timestamp/${TEST_DATE}`)
    .then(function (res) {
      expect(res).to.have.status(200);
      expect('Content-Type', /json/);
      expect(typeof res.unix === "number");
      expect(typeof res.utc === "string");
      expect(typeof Date.parse(res.utc) === "number");
      expect(new Date(TEST_DATE).getTime() === res.unix);
      expect(new Date(TEST_DATE).toUTCString() === (res.utc));
      done();
    })
    .catch(function (err) {
      throw err;
    });
});

it('responds with a unix timestamp and UTC date string of the passed date if the date parameter is a valid unix timestamp in ms', function (done) {
  const TEST_TIMESTAMP = "1450137600";
  chai.request(server)
    .get(`/api/timestamp/${TEST_TIMESTAMP}`)
    .then(function (res) {
      expect(res).to.have.status(200);
      expect('Content-Type', /json/);
      expect(typeof res.unix === "number");
      expect(typeof res.utc === "string");
      expect(typeof Date.parse(res.utc) === "number");
      expect(new Date(Number(TEST_TIMESTAMP)).getTime() === res.unix);
      expect(new Date(Number(TEST_TIMESTAMP)).toUTCString() === (res.utc));
      done();
    })
    .catch(function (err) {
      throw err;
    });
});

it('responds with 422 status code and an error string if the date parameter is invalid date string', function (done) {
  const INVALID_TEST_DATE = "hello world";
  chai.request(server)
    .get(`/api/timestamp/${INVALID_TEST_DATE}`)
    .then(function (res) {
      expect(res).to.have.status(422);
      expect('Content-Type', /json/);
      expect(typeof res.error === "string");
      expect(res).to.not.have.property("unix");
      expect(res).to.not.have.property("utc");
      done();
    })
    .catch(function (err) {
      throw err;
    });
});
