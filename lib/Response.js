/**
 * Sample response types used here: http://labs.omniti.com/labs/jsend
 * @param httpResponse
 * @constructor
 */
var Response = function(httpResponse){
    'use strict';

    var CONTENT_TYPE = 'application/json',
        logger = require('./logger');

    function buildErrorResponse(code, err){
        return {
            code: code,
            status: 'error',
            message: err.message
        };
    }

    this.writeFromPromise = function(promise){
        var self = this;

        promise
            .then(function(obj){
                self.writeSuccess(obj);
            })
            .fail(function(err){
                self.writeError(err);
            });
    };

    this.writeSuccess = function(obj){
        var val = obj || '';
        this.write(Response.statusCodes.success, val);
    };

    this.writeError = function(err){
        var code = err.errorCode || Response.statusCodes.serverError;
        this.write(code, buildErrorResponse(code, err));
    };

    this.write = function(responseCode, responseData){
        var data = JSON.stringify(responseData);

        if(Response.debug){
            logger.debug(responseCode + ' - ' + data);
        }

        httpResponse.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        httpResponse.write(data);
        httpResponse.end();
    };
};

Response.debug = false;
Response.statusCodes = {
    success: 200,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    requestTimeout: 408,
    serverError: 500,
    badGateway: 502,
    serviceUnavailable: 503
};

module.exports = Response;