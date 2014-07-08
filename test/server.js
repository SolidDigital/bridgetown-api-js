'use strict';

var http = require('http'),
    PORT = 3210,
    server,
    bridgetownApi = require('../lib/bridgetown-api'),
    q = require('q');

module.exports = {
    start : start,
    stop : stop,
    configure : configure
};

function start(onReadyFunction) {
    var deferred = q.defer();

    if(server) {
        deferred.reject('Server already running');
        return;
    }

    server = http.createServer(onReadyFunction);
    server.listen(PORT, function(err) {
        if(err) {
            console.log(err);
        }

        console.log('Starting to listen to port: ' +PORT);
        deferred.resolve();
    });

    return deferred.promise;
}
function stop() {
    if(server) {
        console.log('Stopped listening to port: ' +PORT);
        server.close();
        server = undefined;
    }
}
function configure(config) {
    bridgetownApi.configure(config);
}