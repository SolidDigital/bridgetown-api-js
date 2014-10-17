var server = require('./server'),
    bridgetownApi = require('../lib/bridgetown-api'),
    Response = require('../lib/Response'),
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
                var response = new Response(res);
                response.write(200, {success:true});
            });
        });

        request(options)
            .then(function(response) {
                response.success.should.equal(true);
                done();
            })
            .catch(done);

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
                var response = new Response(res);
                req.bridgetown.method.should.equal('Basic');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                response.write(200, {success:true});
            });
        });

        request(options)
            .then(function(response) {
                response.success.should.equal(true);
                done();
            })
            .catch(done);
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
                var response = new Response(res);
                req.bridgetown.method.should.equal('Google');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                response.write(200, {success:true});
            });
        });

        request(options)
            .then(function(response) {
                response.success.should.equal(true);
                done();
            })
            .catch(done);
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
                var response = new Response(res);
                req.bridgetown.method.should.equal('Google');
                req.bridgetown.token.should.equal('Aladdin:open sesame');
                response.write(200, {success:true});
            });
        });

        request(options)
            .then(function(response) {
                response.success.should.equal(true);
                done();
            })
            .catch(done);
    });

    it('Should have a default method of Basic, when only a token is passed.', function(done) {
        var options = {
                host: 'localhost',
                port: port,
                path: '/',
                method: 'GET',
                headers: {
                    authorization: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            };

        server.stop();
        server.start(function(req, res) {
            middleware.authorization(req, res, function() {
                var response = new Response(res);
                req.bridgetown.method.should.equal('Basic');
                response.write(200,{success:true});
            });
        }).then(function(){
            request(options)
                .then(function(response) {
                    response.success.should.equal(true);
                    done();
                })
                .catch(done);
        });

    });

});