'use strict';

var sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

module.exports = {
    getMockExpressResponse: getMockExpressResponse,
    getMockRequest : getMockRequest,
    getMockResponse : getMockResponse,
    runMiddlewares : runMiddlewares
};

function getMockRequest(headers) {
    return {
        headers : headers || {}
    };
}

function getMockResponse() {
    return {
        writeHead : sinon.spy(),
        write : sinon.spy(),
        to:sinon.spy(),
        end : sinon.spy()
    };
}


function getMockExpressResponse() {
    return {
        writeHead : sinon.spy(),
        write : sinon.spy(),
        status : function(code){
            this.statusCode = code;
            return this;
        },
        send: sinon.spy(),
        to:sinon.spy(),
        end : sinon.spy()
    };
}

function runMiddlewares(middlewares, req) {
    var res = getMockResponse(),
        next;

    req = req || getMockRequest();
    next = createNext(middlewares, req, res);

    middlewares[0](req, res, next);

    return {
        req : req,
        res : res,
        next : next
    };
}

function createNext(middlewares, req, res) {
    var index = 0;

    return function _next() {
        ++index;
        middlewares[index](req, res, _next);
    };
}
