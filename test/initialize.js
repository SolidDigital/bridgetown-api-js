'use strict';

var chai = require('chai'),
    utilities = require('./utilities'),
    getMockResponse = utilities.getMockResponse,
    sinonChai = require('sinon-chai'),
    bridgetown = require('../lib/bridgetown-api'),
    Promise = require('bluebird');

chai.should();
chai.use(sinonChai);




describe('Test common responses', function(){
    it('uses express.send if available', function() {
        var req = {},
            res = utilities.getMockExpressResponse(),
            next = function() {
                res.writeSuccess();

                res.statusCode.should.equal(200);
                res.send.should.have.been.calledOnce;

                // in reality these will get called, but we know send is mocked, so, for testing, that's all the should happen
                res.writeHead.should.not.have.been.called;
                res.write.should.not.have.been.called;
                res.end.should.not.have.been.called;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeBadRequest should return 400', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeBadRequest();

                res.writeHead.should.have.been.calledWith(400, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 400,
                    status: 'error',
                    message: 'Bad Request'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeError should write custom error', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeError({
                    message : 'Too many turkeys',
                    code : 411
                });

                res.writeHead.should.have.been.calledWith(411, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 411,
                    status: 'error',
                    message: 'Too many turkeys'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeForbidden should return 403', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeForbidden();

                res.writeHead.should.have.been.calledWith(403, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 403,
                    status: 'error',
                    message: 'Forbidden'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    describe('writeFromPromise', function() {
        it('when promise resolved should writeSuccess', function(done) {
            var req = {},
                res = getMockResponse(),
                next = function() {
                    var promise = new Promise(function(resolve) {
                        resolve({ name : 'Binary Harry' });
                    });
                    res.writeFromPromise(promise);

                    // Promises are always async, so we have to wait a cycle before checking on things
                    process.nextTick(function() {
                        res.writeHead.should.have.been.calledWith(200, {'Content-Type': 'application/json'});
                        res.write.should.have.been.calledWith(JSON.stringify({
                            name : 'Binary Harry'
                        }));
                        res.end.should.have.been.calledOnce;
                        done();
                    });
                };

            bridgetown.middleware.initialize()(req, res, next);
        });

        it('when promise is rejected should writeError', function(done) {
            var req = {},
                res = getMockResponse(),
                next = function() {
                    var promise = new Promise(function(resolve, reject) {
                        reject({
                            code : 808,
                            message : 'We pau'
                        });
                    });

                    res.writeFromPromise(promise);

                    // Promises are always async, so we have to wait a cycle before checking on things
                    process.nextTick(function() {
                        res.writeHead.should.have.been.calledWith(808, {'Content-Type': 'application/json'});
                        res.write.should.have.been.calledWith(JSON.stringify({
                            code : 808,
                            status : 'error',
                            message : 'We pau'
                        }));
                        res.end.should.have.been.calledOnce;
                        done();
                    });
                };

            bridgetown.middleware.initialize()(req, res, next);
        });
    });

    it('writeNotFound should return 404', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeNotFound();

                res.writeHead.should.have.been.calledWith(404, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 404,
                    status: 'error',
                    message: 'Not Found'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeServerError should return 500', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeServerError();

                res.writeHead.should.have.been.calledWith(500, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 500,
                    status: 'error',
                    message: 'Server Error'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeServiceUnavailable should return 503', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeServiceUnavailable();

                res.writeHead.should.have.been.calledWith(503, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 503,
                    status: 'error',
                    message: 'Service Unavailable'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeSuccess should return 200', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeSuccess({
                    object: '[Object]'
                });

                res.writeHead.should.have.been.calledWith(200, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    object: '[Object]'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeTimeout should return 408', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeTimeout();

                res.writeHead.should.have.been.calledWith(408, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 408,
                    status: 'error',
                    message: 'Request timed out'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

    it('writeUnauthorized should return unauthorized', function() {
        var req = {},
            res = getMockResponse(),
            next = function() {
                res.writeUnauthorized();

                res.writeHead.should.have.been.calledWith(401, {'Content-Type': 'application/json'});
                res.write.should.have.been.calledWith(JSON.stringify({
                    code: 401,
                    status: 'error',
                    message: 'Unauthorized'
                }));
                res.end.should.have.been.calledOnce;
            };

        bridgetown.middleware.initialize()(req, res, next);
    });

});