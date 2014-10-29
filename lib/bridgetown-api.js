'use strict';

var Response = require('./Response'),
    Strings = require('./Strings'),
    logger = require('./logger'),
    middleware = {
        authorization: require('./middleware/authorization'),
        apiKey: require('./middleware/apiKey'),
        initialize: require('./middleware/initialize')
    },
    _ = require('lodash');

var app = {};
Response.prototype.app = app;

module.exports = _.extend(app, {
    middleware : middleware,
    Response : Response,
    Strings : Strings
});


app.debug = false;

app.useLogger = function(implementation){
    logger.init(implementation);
};

app.logger = logger.init();
