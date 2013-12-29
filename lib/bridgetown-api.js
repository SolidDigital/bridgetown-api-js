var Response = require('./Response'),
    Strings = require('./Strings'),
    Preconditions = {
        Authorization: require('./Preconditions/Authorization'),
        Authentication: require('./Preconditions/Authentication'),
        ApiKey: require('./Preconditions/ApiKey')
    };


module.exports = (function(){
    "use strict";

    var api = {};

    api.configure = function(method){
        method.apply(this);
    };

    api.validate = {
        token: function(method){
            Preconditions.Authorization.validate = method;
        },
        apiKey: function(method){
            Preconditions.ApiKey.validate = method;
        },
        authentication: function(method){
            Preconditions.Authentication.validate = method;
        }
    };

    return api;
})();


module.exports.Preconditions = Preconditions;
module.exports.Response = Response;
module.exports.Strings  = Strings;