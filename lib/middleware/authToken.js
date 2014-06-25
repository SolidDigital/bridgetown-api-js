/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 */
var authToken = function(httpRequest, httpResponse, next){
    'use strict';

    var Strings = require('../Strings'),
        Response = require('../Response'),
        strings = new Strings('en'),
        response = new Response(httpResponse);

    if(!httpRequest.bridgetown){
        httpRequest.bridgetown = {};
    }

    function setIdentity(identity){
        httpRequest.bridgetown.identity = identity;
        next();
    }

    function setUnauthorized(err){
        err = new Error(strings.group('errors').unauthorized);
        err.errorCode = Response.statusCodes.unauthorized;

        response.writeError(err);
    }

    if(authToken.validate) {
        authToken.validate({
            token: httpRequest.bridgetown.token,
            method: httpRequest.bridgetown.method
        }).then(setIdentity).fail(setUnauthorized);
    }
};

module.exports = authToken;