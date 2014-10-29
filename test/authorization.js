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

    it('it calls next if an authorization header is provided', function(done) {
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

    it('should attach the auth method to req.bridgetown.method', function(done) {
        var req = {
                headers : {
                    authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                function(req, res, next) {
                    req.bridgetown.method.should.equal('Basic');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('should attach the decoded token to req.bridgetown.token', function(done) {
        var req = {
                headers : {
                    authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                function(req, res, next) {
                    req.bridgetown.token.should.equal('Aladdin:open sesame');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('should attach Google as the authentication method when given google in the token.', function(done) {
        var req = {
                headers : {
                    authorization: 'Google QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                function(req, res, next) {
                    req.bridgetown.method.should.equal('Google');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('should attach Google as the authentication method when given google in the token - even with 2 spaces for separation.', function(done) {
        var req = {
                headers : {
                    authorization: 'Google  QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                function(req, res, next) {
                    req.bridgetown.method.should.equal('Google');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('Should have a default method of Basic, when only a token is passed.', function(done) {
        var req = {
                headers : {
                    authorization: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(),
                function(req, res, next) {
                    req.bridgetown.token.should.equal('Aladdin:open sesame');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('should set req.bridgetown.identity to what is used to resolve the deferred passed to the auth method', function(done) {
        var req = {
                headers : {
                    authorization: 'QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(function(tokenObject, deferred) {
                    deferred.resolve('boomy');
                }),
                function(req, res, next) {
                    req.bridgetown.identity.should.equal('boomy');
                    next();
                },
                done.bind(done, undefined)
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('should call the auth method with a token object made of the auth method and decoded auth token', function(done) {
        var req = {
                headers : {
                    authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(function(tokenObj) {
                    tokenObj.method.should.equal('Basic');
                    tokenObj.token.should.equal('Aladdin:open sesame');
                    done();
                })
            ];

        utilities.runMiddlewares(middlewares, req);
    });

    it('rejecting the deferred passed into the auth method results in an unauthorized response', function(done) {
        var req = {
                headers : {
                    authorization: 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='
                }
            },
            middlewares = [
                bridgetown.middleware.initialize(),
                bridgetown.middleware.authorization(function(tokenObj, deferred) {
                    deferred.reject();
                })
            ],
            options = utilities.runMiddlewares(middlewares, req);

        process.nextTick(function() {
            var res = options.res;
            res.writeHead.should.have.been.calledWith(401, {'Content-Type': 'application/json'});
            res.write.should.have.been.calledWith(JSON.stringify({
                code: 401,
                status: 'error',
                message: 'Unauthorized'
            }));
            res.end.should.have.been.calledOnce;
            done();
        });
    });
});