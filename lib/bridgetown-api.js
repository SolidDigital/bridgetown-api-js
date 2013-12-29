var Response = require('./Response'),
    Strings = require('./Strings'),
    Preconditions = {
        Authorization: require('./middleware/Authorization'),
        AuthToken: require('./middleware/AuthToken'),
        ApiKey: require('./middleware/ApiKey')
    };


module.exports = (function(){
    "use strict";

    var api = {};

    api.configure = function(method){
        method.apply(this);
    };

    api.validate = {
        apiKey: function(method){
            Preconditions.ApiKey.validate = method;
        },
        token: function(method){
            Preconditions.AuthToken.validate = method;
        }
    };

    return api;
})();


module.exports.Preconditions = Preconditions;
module.exports.Response = Response;
module.exports.Strings  = Strings;