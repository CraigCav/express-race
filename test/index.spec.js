var express = require('express');
var request = require('supertest');
var race = require('..');

describe('race', function() {
  it('should respond with first successful response', function(done){
    var app = express();

    var middleware1 = function(req, res, next) {
      res.send('middleware1');
    };

    var middleware2 = function(req, res, next) {
      setTimeout(function() {
        res.send('middleware2');
      }, 500);
    };

    app.get('/', race(middleware1, middleware2));

    request(app).get('/').expect(200, 'middleware1', done);
  });

  it('should respond with last error when all middlewares fail', function(done){
    var app = express();

    var middleware1 = function(req, res, next) {
      next(Error('middleware1'));
    };

    var middleware2 = function(req, res, next) {
      next(Error('middleware2'));
    };

    app.get('/', race(middleware1, middleware2));

    app.use(function(err, req, res, next) {
      res.status(500).send(err.message);
    });

    request(app).get('/').expect(500, 'middleware2', done);
  });
});