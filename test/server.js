'use strict';

var http = require('http'),
    PORT = 3210,
    server,
    bridgetownApi = require('../lib/bridgetown-api');

module.exports = {
    start : start,
    stop : stop,
    configure : configure
};

function start(onReadyFunction) {
    if(server) {
        return;
    }

    console.log('Starting to listen to port: ' +PORT);
    server = http.createServer(onReadyFunction);
    server.listen(PORT);
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