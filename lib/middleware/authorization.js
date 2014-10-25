'use strict';

var Response = require('../Response');

/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 */
module.exports = function(authenticationMethod) {
    return function(httpRequest, httpResponse, next){

        var authHeader = httpRequest.headers.authorization,
            authArray,
            method,
            token;

        if (!authHeader) {
            respondeWithUnauthorized(httpResponse);
            return;
        }

        authArray = authHeader.split(/\s+/);

        if(authArray.length === 1) {
            token = authArray[0];
            method = 'Basic';
        } else {
            method = authArray[0];
            token = authArray[1];
        }

        if(!httpRequest.bridgetown){
            httpRequest.bridgetown = {};
        }

        httpRequest.bridgetown.method = method;
        httpRequest.bridgetown.token = new Buffer(token, 'base64').toString();
        next();
    };
};

function respondeWithUnauthorized(httpResponse) {
    var err,
        Strings = require('../Strings'),
        strings = new Strings('en'),
        response = new Response(httpResponse);

    err = new Error(strings.group('errors').missing_credentials);
    err.errorCode = Response.prototype.statusCodes.unauthorized;

    response.writeError(err);
}