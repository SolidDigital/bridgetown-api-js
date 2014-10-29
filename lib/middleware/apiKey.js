'use strict';

var Strings = require('../Strings'),
    Response = require('../Response'),
    strings = new Strings('en'),
    Promise = require('bluebird');

module.exports = apiKey;

/**
 * The apikey module is responsible for checking for the correct header then calling a validation function.
 * The "validate" function is linked up when setting up the bridgetown api and the business rules are usually defined
 * by the implementation code. If the apikey is valid then the next call in the chain will occur, if not then
 * it will return an error response.
 *
 * To use this middleware, call it by passing in an api key validation function. A curried middleware method will be
 * returned for use with that validation method.
 */
function apiKey(apiKeyValidationMethod) {
    if (!apiKeyValidationMethod) {
        throw new Error(strings.group('errors').missing_api_key_validation_method);
    }

    return function(httpRequest, httpResponse, next){
        var response = new Response(httpResponse),
            apiKeyHeader = httpRequest.headers['x-api-key'],
            err = null;

        if(!httpRequest.bridgetown){
            httpRequest.bridgetown = {};
        }

        if(apiKeyHeader){
            new Promise(function (resolve, reject) {
                apiKeyValidationMethod(apiKeyHeader, {
                    resolve : resolve,
                    reject : reject,
                    promise : this
                });
            })
                .then(setApiKey.bind(null, httpRequest, apiKeyHeader, next))
                .catch(setError.bind(null, response));


        } else {
            err = new Error(strings.group('errors').missing_api_key);
            err.errorCode = Response.prototype.statusCodes.unauthorized;
            response.writeError(err);
        }

    };
}

function setError(response){
    response.writeError({
        code : 403,
        message : strings.group('errors').invalid_api_key
    });
}

function setApiKey(httpRequest, apiKeyHeader, next){
    httpRequest.bridgetown.apikey = apiKeyHeader;
    next();
}



