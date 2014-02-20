/**
 * Sample response types used here: http://labs.omniti.com/labs/jsend
 * @param httpResponse
 * @constructor
 */
var Response = function(httpResponse){
    'use strict';

    var CONTENT_TYPE = 'application/json',
        Strings = require('./Strings'),
        strings = new Strings('en'),
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
        var code = err.errorCode || err.code || Response.statusCodes.serverError;
        this.write(code, buildErrorResponse(code, err));
    };

    this.writeUnauthorized = function(){
        var err = new Error(strings.group('errors').unauthorized);
        err.errorCode = Response.statusCodes.unauthorized;
        this.writeError(err);
    };

    this.writeForbidden = function(){
        var err = new Error(strings.group('errors').forbidden);
        err.errorCode = Response.statusCodes.forbidden;
        this.writeError(err);
    };

    this.writeNotFound = function(){
        var err = new Error(strings.group('errors').not_found);
        err.errorCode = Response.statusCodes.notFound;
        this.writeError(err);
    };

    this.writeTimeout = function(){
        var err = new Error(strings.group('errors').timeout);
        err.errorCode = Response.statusCodes.requestTimeout;
        this.writeError(err);
    };

    this.writeBadRequest = function(){
        var err = new Error(strings.group('errors').bad_request);
        err.errorCode = Response.statusCodes.badRequest;
        this.writeError(err);
    };

    this.writeServerError = function(){
        var err = new Error(strings.group('errors').server_error);
        err.errorCode = Response.statusCodes.serverError;
        this.writeError(err);
    };

    this.writeServiceUnavailable = function(){
        var err = new Error(strings.group('errors').service_unavailable);
        err.errorCode = Response.statusCodes.serviceUnavailable;
        this.writeError(err);
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