'use strict';
/**
 * Sample response types used here: http://labs.omniti.com/labs/jsend
 * @param httpResponse
 * @constructor
 */

var CONTENT_TYPE = 'application/json',
    Strings = require('./Strings'),
    strings = new Strings('en'),
    logger = require('./logger');

module.exports = Response;

function Response(httpResponse){
    this.httpResponse = httpResponse;
    return this;
}

Response.prototype.debug = false;

Response.prototype.write = write;
Response.prototype.writeBadRequest = writeBadRequest;
Response.prototype.writeError = writeError;
Response.prototype.writeForbidden = writeForbidden;
Response.prototype.writeFromPromise = writeFromPromise;
Response.prototype.writeNotFound = writeNotFound;
Response.prototype.writeServerError = writeServerError;
Response.prototype.writeServiceUnavailable = writeServiceUnavailable;
Response.prototype.writeSuccess = writeSuccess;
Response.prototype.writeTimeout = writeTimeout;
Response.prototype.writeUnauthorized = writeUnauthorized;

Response.prototype.statusCodes = {
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


function _buildErrorResponse(code, err){
    return {
        code: code,
        status: 'error',
        message: err.message
    };
}

function writeFromPromise(promise){
    var self = this;

    promise
        .then(function(obj){
            self.writeSuccess(obj);
        })
        .catch(function(err){
            self.writeError(err);
        });
}

function writeSuccess(obj){
    var val = obj || '';
    this.write(this.statusCodes.success, val);
}

function writeError(err){
    var code = err.errorCode || err.code || this.statusCodes.serverError;
    this.write(code, _buildErrorResponse(code, err));
}

function writeUnauthorized(){
    var err = new Error(strings.group('errors').unauthorized);
    err.errorCode = this.statusCodes.unauthorized;
    this.writeError(err);
}

function writeForbidden(){
    var err = new Error(strings.group('errors').forbidden);
    err.errorCode = this.statusCodes.forbidden;
    this.writeError(err);
}

function writeNotFound(){
    var err = new Error(strings.group('errors').not_found);
    err.errorCode = this.statusCodes.notFound;
    this.writeError(err);
}

function writeTimeout(){
    var err = new Error(strings.group('errors').timeout);
    err.errorCode = this.statusCodes.requestTimeout;
    this.writeError(err);
}

function writeBadRequest(){
    var err = new Error(strings.group('errors').bad_request);
    err.errorCode = this.statusCodes.badRequest;
    this.writeError(err);
}

function writeServerError(){
    var err = new Error(strings.group('errors').server_error);
    err.errorCode = this.statusCodes.serverError;
    this.writeError(err);
}

function writeServiceUnavailable(){
    var err = new Error(strings.group('errors').service_unavailable);
    err.errorCode = this.statusCodes.serviceUnavailable;
    this.writeError(err);
}


function write(responseCode, responseData){
    var data = JSON.stringify(responseData);

    if(this.app.debug){
        logger.debug(responseCode + ' - ' + data);
    }

    this.httpResponse.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
    this.httpResponse.write(data);
    this.httpResponse.end();
}