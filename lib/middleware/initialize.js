'use strict';

var Response = require('../Response');

module.exports = function() {
    return function (req, res, next) {
        var response = new Response(res);

        // write is internal, we don't want to clobber the one that is already available
        [
            'writeBadRequest',
            'writeError',
            'writeForbidden',
            'writeFromPromise',
            'writeNotFound',
            'writeServerError',
            'writeServiceUnavailable',
            'writeSuccess',
            'writeTimeout',
            'writeUnauthorized'

        ]
            .reduce(function(res, method) {
                res[method] = response[method].bind(response);
                return res;
            }, res);

        next();
    };
};
