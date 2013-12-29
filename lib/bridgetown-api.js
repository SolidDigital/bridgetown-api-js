var Response = require('./Response'),
    Strings = require('./Strings'),
    middleware = {
        authorization: require('./middleware/Authorization'),
        authToken: require('./middleware/AuthToken'),
        apiKey: require('./middleware/ApiKey')
    };


module.exports = (function(){
    "use strict";

    var api = {};

    api.configure = function(method){
        method.apply(this);
    };

    api.validate = {
        apiKey: function(method){
            middleware.apiKey.validate = method;
        },
        token: function(method){
            middleware.authToken.validate = method;
        }
    };

    return api;
})();


module.exports.middleware = middleware;
module.exports.Response = Response;
module.exports.Strings  = Strings;