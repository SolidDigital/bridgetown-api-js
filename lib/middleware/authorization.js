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
        authArray,
        method,
        token,
        err;

    function throwError() {
        err = new Error(strings.group('errors').missing_credentials);
        err.errorCode = Response.statusCodes.unauthorized;

        response.writeError(err);
    }

    if(authHeader){
        authArray = authHeader.split(/\s+/);

        method = authArray[0];

        if(authArray.length > 1) {
            token = authArray[1];
        } else {
            throwError();
        }

        if(!httpRequest.bridgetown){
            httpRequest.bridgetown = {};
        }

        httpRequest.bridgetown.method = method;
        httpRequest.bridgetown.token = new Buffer(token, 'base64').toString();
        next();
    }
    else {
        throwError();
    }
};