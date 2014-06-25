var server = require('./server'),
    bridgetownApi = require('../lib/bridgetown-api'),
    middleware = bridgetownApi.middleware;

require('chai').should();

describe('Authorization Validation', function(){
    'use strict';

    var port = 3210,
        request = require('./request');

    afterEach(function() {
        server.stop();
    });

    it('should receive a 401 Because the authorization header is not provided.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET'
            };

        server.start(function(req, res) {
            middleware.authorization(req, res, function() {
                true.should.equal(false); // It should not get here.
            });
        });

        request(options).then(function(response) {
            response.code.should.equal(401);
            response.message.should.equal('Authorization credentials not provided.');
        }).done(done);
    });

    it('should have it\'s callback called successfully because the authorization header is present.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'Token QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.start(function(req, res) {
            middleware.authorization(req, res, function() {
                // If it gets here then we are good.
                done();
            });
        });

        request(options).then(function(response) {
            response.body.status.should.equal(200);
        }).done();

    });

    it('should return an object representing the authorization method supplied.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.start(function(req, res) {
            middleware.authorization(req, res, function() {
                req.bridgetown.method.should.equal('Basic');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                done();
            });
        });

        request(options).then(function(response) {
            response.body.status.should.equal(200);
        }).done();
    });

    it('should return an Google as the authentication method when given google in the token.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'Google QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.start(function(req, res) {
            middleware.authorization(req, res, function(){
                req.bridgetown.method.should.equal('Google');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                done();
            });
        });

        request(options).then(function(response) {
            response.body.status.should.equal(200);
        }).done();
    });

    it('should return an Google as the authentication method when given google in the token and 2 spaces between', function(done) { //jshint ignore:line
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'Google  QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.start(function (req, res) {
            middleware.authorization(req, res, function() {
                req.bridgetown.method.should.equal('Google');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                done();
            });
        });

        request(options).then(function(response) {
            response.body.status.should.equal(200);
        }).done();
    });

    xit('should fail when token cannot be split into method and token.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'GoogleQWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.start(function (req, res) {
            middleware.authorization(req, res, function(){
                console.log('this guys'); // Should not be called
                done();
            });
        });

        request(options).then(function(response) {
            console.log('THIS GUY');
            console.log(response);
            done();
        }).done();
    });

    xit('should fail when token and method are the same thing (no method or token provided).', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'Google Google'
                }
            };

        server.start(function(req, res) {
            middleware.authorization(req, res, function() {
                true.should.equal(false); // it should not get here.
                done();
            });
        });

        request(options).then(function(response) {
            true.should.equal(false);
            console.log(response);
        }).done(done);

    });

});