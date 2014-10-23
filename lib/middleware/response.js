'use strict';

var Response = require('../Response');

module.exports = function (req, res, next) {
    var response = new Response(res);

    [
        'writeUnauthorized',
        'writeNotFound',
        'writeBadRequest',
        'writeForbidden',
        'writeServerError',
        'writeServiceUnavailable',
        'writeTimeout',
        'writeError'
    ]
        .reduce(function(res, method) {
            res[method] = response[method].bind(response);
            return res;
        }, res);

    next();
};