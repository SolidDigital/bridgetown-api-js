/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 */
module.exports = function(httpRequest, httpResponse, next){
    'use strict';

    var Strings = require('../Strings'),
        Response = require('../Response'),
        strings = new Strings('en'),
        response = new Response(httpResponse),
        authHeader = httpRequest.headers.authorization,
        token,
        err;

    if(authHeader){
        token = authHeader.split(/\s+/).pop()||'';

        if(!httpRequest.bridgetown){
            httpRequest.bridgetown = {};
        }

        httpRequest.bridgetown.token = new Buffer(token, 'base64').toString();

        next();
    }
    else {
        err = new Error(strings.group('errors').missing_credentials);
        err.errorCode = response.STATUS_CODES.UNAUTHORIZED;

        response.writeError(err);
    }
};