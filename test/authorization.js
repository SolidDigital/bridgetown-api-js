'use strict';
var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    bridgetown = require('../lib/bridgetown-api'),
    utilities = require('./utilities');

chai.should();
chai.use(sinonChai);

describe('Authorization Validation', function(){

    it('sends a 401 if no authorization header is provided', function(done) {
        var req = {
                headers : {}
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization()
            ],
            options = utilities.runMiddlewares(middlewares, req);

        process.nextTick(function() {
            var res = options.res;
            res.writeHead.should.have.been.calledWith(401, {'Content-Type': 'application/json'});
            res.write.should.have.been.calledWith(JSON.stringify({
                code: 401,
                status: 'error',
                message: 'Authorization credentials not provided.'
            }));
            res.end.should.have.been.calledOnce;
            done();
        });
    });

    it('it calls next if an authorization heder is provided', function(done) {
        var req = {
                headers : {
                    authorization: 'Token QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    xit('should return an object representing the authorization method supplied.', function(done) {
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

    xit('should return an Google as the authentication method when given google in the token.', function(done) {
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

    xit('should return an Google as the authentication method when given google in the token and 2 spaces between', function(done) { //jshint ignore:line
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

    xit('Should have a default method of Basic, when only a token is passed.', function(done) {
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