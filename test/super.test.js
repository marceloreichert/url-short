'use strict';

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();
var assert = require('assert');

chai.use(chaiHttp);

require('dotenv').config();

describe('Test Endpoints', function() {

  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect(process.env.MONGODB_URI_TEST, function(error, db) {
    assert.equal(null, error);
    
    var users = db.collection('users');
    users.deleteMany({}, function(err, result) {
      assert.equal(null,err);
      
      var counters = db.collection('counters');
      counters.deleteMany({}, function(err, result) {
        assert.equal(null,err);
        counters.insertOne({id: "url_counter", sequence: 100}, function(error, result) {
          
          var urls = db.collection('urls');
          urls.deleteMany({}, function(err, result) {
            assert.equal(null,err);
            db.close();
          });
        });
      });
    });
  });


  it('POST new user - should return a 201 Created from POST /users', function(done) {
    chai.request(app)
      .post('/users')
      .send({'id': 'marceloreichert'})
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal('marceloreichert');
        done();
      });
  });

  it('POST new user - should return a 201 Created from POST /users', function(done) {
    chai.request(app)
      .post('/users')
      .send({'id': 'reichert'})
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal('reichert');
        done();
      });
  });

  it('POST new user - should return a 201 Created from POST /users', function(done) {
    chai.request(app)
      .post('/users')
      .send({'id': 'marcelo'})
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal('marcelo');
        done();
      });
  });

  it('POST new user - should return a 409 Conflict response from POST /users', function(done) {
    chai.request(app)
      .post('/users')
      .send({'id': 'marceloreichert'})
      .end(function(err, res) {
        res.should.have.status(409);
        done();
      });
  });


  it('POST add url - should return a 201 Created from POST /users/:iserid/urls', function(done) {
    chai.request(app)
      .post('/users/marceloreichert/urls')
      .send({'url': 'http://www.powertask.com.br'})
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal(100);
        res.body.should.have.property('hits');
        res.body.hits.should.equal(0);
        res.body.should.have.property('url');
        res.body.url.should.equal('http://www.powertask.com.br');
        res.body.should.have.property('shortUrl');
        res.body.shortUrl.should.equal(process.env.HOST+'2J');
        done();
      });
  });

  it('POST add url - should return a 201 Created from POST /users/:iserid/urls', function(done) {
    chai.request(app)
      .post('/users/reichert/urls')
      .send({'url': 'http://www.powertask.com.br'})
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal(101);
        res.body.should.have.property('hits');
        res.body.hits.should.equal(0);
        res.body.should.have.property('url');
        res.body.url.should.equal('http://www.powertask.com.br');
        res.body.should.have.property('shortUrl');
        res.body.shortUrl.should.equal(process.env.HOST+'2K');
        done();
      });
  });



  it('GET user stats - should return a 404 Not found from GET /users/marcelo/stats', function(done) {
    chai.request(app)
      .get('/users/marcelo/stats')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });

  it('GET user stats - should return a 200 Not found from GET /users/marceloreichert/stats', function(done) {
    chai.request(app)
      .get('/users/marceloreichert/stats')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('hits');
        res.body.hits.should.equal(0);
        res.body.should.have.property('urlCount');
        res.body.urlCount.should.equal(1);
        res.body.should.have.property('topUrls');
        done();
      });
  });


  it('GET stats - should return a 200 from GET /stats', function(done) {
    chai.request(app)
      .get('/stats')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('hits');
        res.body.hits.should.equal(0);
        res.body.should.have.property('urlCount');
        res.body.urlCount.should.equal(2);
        res.body.should.have.property('topUrls');
        done();
      });
  });

  
  it('GET urls stats - should return a 200  from GET /stats/:id', function(done) {
    chai.request(app)
      .get('/stats/101')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.equal(101);
        res.body.should.have.property('hits');
        res.body.hits.should.equal(0);
        res.body.should.have.property('url');
        res.body.url.should.equal('http://www.powertask.com.br');
        res.body.should.have.property('shortUrl');
        res.body.shortUrl.should.equal(process.env.HOST+'2K');
        done();
      });
  });


  it('DELETE user 404 Not found', function(done) {
    chai.request(app)
      .delete('/users/xxx')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });

  it('DELETE user 200 Ok', function(done) {
    chai.request(app)
      .delete('/users/marcelo')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });


  it('DELETE urls 200 Ok', function(done) {
    chai.request(app)
      .delete('/urls/101')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });

  it('DELETE urls 404 Not found', function(done) {
    chai.request(app)
      .delete('/urls/2')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });


});
