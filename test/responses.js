'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    bridgetown = require('../lib/bridgetown-api');

chai.should();
chai.use(sinonChai);


function getMockResponse() {
    return {
        writeHead : sinon.spy(),
        write : sinon.spy(),
        to:sinon.spy(),
        end : sinon.spy()
    };
}

describe('Test common responses', function(){

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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
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

        bridgetown.middleware.response(req, res, next);
    });

    it('should write custom error with writeError', function() {
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

        bridgetown.middleware.response(req, res, next);
    });
});