var Response = require('./Response'),
    Strings = require('./Strings'),
    logger = require('./logger'),
    middleware = {
        authorization: require('./middleware/authorization'),
        authToken: require('./middleware/authToken'),
        apiKey: require('./middleware/apiKey'),
        response: require('./middleware/response')
    };


module.exports = (function(){
    'use strict';

    var app = {};
    app.debug = false;
    
    app.useLogger = function(implementation){
        logger.init(implementation);
    };

    app.configure = function(method){
        if (method.length) {
            method(this);
        } else {
            method.apply(this);
        }
        Response.debug = this.debug;
    };

    app.validate = {
        apiKey: function(method){
            middleware.apiKey.validate = method;
        },
        token: function(method){
            middleware.authToken.validate = method;
        }
    };

    app.logger = logger.init();

    return app;
})();


module.exports.middleware = middleware;
module.exports.Response = Response;
module.exports.Strings  = Strings;
