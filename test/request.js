
module.exports = function (options) {
    'use strict';

    var body = '',
        q = require('q'),
        http = require('http'),
        deferred = q.defer(),
        req = http.request(options, function(res){
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                var response = JSON.parse(body);
                deferred.resolve(response);
            });
        });

    req.end();
    return deferred.promise;
};