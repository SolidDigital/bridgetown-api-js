/**
 * The apikey module is responsible for checking for the correct header then calling a validation function.
 * The "validate" function is linked up when setting up the bridgetown api and the business rules are usually defined
 * by the implementation code. If the apikey is valid then the next call in the chain will occur, if not then
 * it will return an error response.
 */
var apiKey = function(httpRequest, httpResponse, next){
    "use strict";

    var Strings = require('../Strings'),
        Response = require('../Response'),
        strings = new Strings('en'),
        response = new Response(httpResponse),
        apiKeyHeader = httpRequest.headers['x-api-key'],
        err = null;

    if(!httpRequest.bridgetown){
        httpRequest.bridgetown = {};
    }

    function setError(err){
        response.writeError(err);
    }

    function setApiKey(){
        httpRequest.bridgetown.apikey = apiKeyHeader;
        next();
    }

    if(apiKeyHeader){
        if(apiKey.validate) {
            apiKey.validate(apiKeyHeader).then(setApiKey).fail(setError);
        }
        else {
            err = new Error(strings.group('errors').missing_api_key_validation_method);
            err.errorCode = response.STATUS_CODES.FORBIDDEN;

            response.writeError(err);
        }
    }
    else {
        err = new Error(strings.group('errors').missing_api_key);
        err.errorCode = response.STATUS_CODES.UNAUTHORIZED;

        response.writeError(err);
    }

};

module.exports = apiKey;