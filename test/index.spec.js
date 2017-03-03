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
});