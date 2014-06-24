'use strict';

var http = require('http'),
    PORT = 3210,
    server,
    bridgetownApi = require('../lib/bridgetown-api'),
    middleware = bridgetownApi.middleware;

module.exports = {
    start : start,
    stop : stop,
    configure : configure
};


function start() {
    if(server) {
        return;
    }

    console.log('Starting to listen to port: ' +PORT);
    server = http.createServer(function (req, res) {
        middleware.apiKey(req, res, function(){
            throw new Error();
        });
    });
    server.listen(PORT);
}
function stop() {
    if(server) {
        server.close();
        server = undefined;
    }
}
function configure(config) {
    bridgetownApi.configure(config);
}