/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 */
module.exports = function(httpRequest, httpResponse, next){
    "use strict";

    var Strings = require('../Strings'),
        Response = require('../Response'),
        strings = new Strings('en'),
        response = new Response(httpResponse),
        apiKeyHeader = httpRequest.headers['X-API-KEY'];

    function setError(err){
        var errorCode = err.errorCode || response.STATUS_CODES.SERVER_ERROR;
        response.write(errorCode, JSON.stringify(err));
    }

    function setApiKey(){
        if(!httpRequest.bridgetown){
            httpRequest.bridgetown = {};
        }

        httpRequest.bridgetown.apikey = apiKeyHeader;
        next();
    }

    if(apiKeyHeader){
        this.validate(apiKeyHeader).then(setApiKey).fail(setError);
    }
    else {
        response.write(response.STATUS_CODES.UNAUTHORIZED, JSON.stringify({message: strings.group('errors').missing_api_key}));
    }
};