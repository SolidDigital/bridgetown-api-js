/**
 * Sample response types used here: http://labs.omniti.com/labs/jsend
 * @param httpResponse
 * @constructor
 */
var Response = function(httpResponse){
    "use strict";

    var CONTENT_TYPE = 'application/json';

    this.STATUS_CODES = {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        REQUEST_TIMEOUT: 408,
        SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503
    };

    function buildSuccessfullResponse(data){
        return {
            status: "success",
            data: data
        };
    }

    function buildErrorResponse(code, err){
        return {
            code: code,
            status: "error",
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
        var val = obj || "";
        this.write(this.STATUS_CODES.SUCCESS, buildSuccessfullResponse(val));
    };

    this.writeError = function(err){
        var code = err.errorCode || this.STATUS_CODES.SERVER_ERROR;
        this.write(code, buildErrorResponse(code, err));
    };

    this.write = function(responseCode, responseData){
        httpResponse.writeHead(responseCode, { 'Content-Type': CONTENT_TYPE });
        httpResponse.write(JSON.stringify(responseData));
        httpResponse.end();
    };
};

module.exports = Response;