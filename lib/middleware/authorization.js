'use strict';

var Response = require('../Response'),
    Promise = require('bluebird'),
    Strings = require('../Strings');

/**
 * The authenticate module is responsible to getting the authorization header from the request and attaching
 * the token to the request. If the credentials are not supplied then the request should fail and not proceed
 * any further.
 *
 * The middileware is initialized with an authentication method. This method - if supplied - is called with a resolve
 * method, a reject method, and a hash of the token and method. If it is resolved with a value, that value is set to
 * req.bridgetown.identity for convenience of access in downstream layers.
 *
 * This middleware can be used to implement basic access authentication. Suggested use if over https.
 *
 * http://en.wikipedia.org/wiki/Basic_access_authentication#Client_side
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

        // The default method is Basic, it is added if not provided
        if(authArray.length === 1) {
            token = authArray[0];
            method = 'Basic';
        } else {
            method = authArray[0];
            token = authArray[1];
        }

        httpRequest.bridgetown = httpRequest.bridgetown || {};

        httpRequest.bridgetown.method = method;
        httpRequest.bridgetown.token = new Buffer(token, 'base64').toString();

        if(authenticationMethod) {

            new Promise(function(resolve, reject) {

                authenticationMethod({
                    token: httpRequest.bridgetown.token,
                    method: httpRequest.bridgetown.method
                }, {
                    resolve: resolve,
                    reject: reject,
                    promise: this
                });

            })
                .then(setIdentity.bind(null, httpRequest))
                .then(next)
                .catch(setUnauthorized.bind(null, httpResponse));
        } else {
            next();
        }
    };
};

function respondeWithUnauthorized(httpResponse) {
    var err,
        strings = new Strings('en'),
        response = new Response(httpResponse);

    err = new Error(strings.group('errors').missing_credentials);
    err.errorCode = Response.prototype.statusCodes.unauthorized;

    response.writeError(err);
}

function setIdentity(httpRequest, identity){
    httpRequest.bridgetown.identity = identity;
}

function setUnauthorized(httpResponse, err){
    var strings = new Strings('en'),
        response = new Response(httpResponse);

    err = new Error(strings.group('errors').unauthorized);
    err.errorCode = Response.prototype.statusCodes.unauthorized;

    response.writeError(err);
}